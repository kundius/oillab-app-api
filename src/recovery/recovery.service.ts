import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Browser } from 'puppeteer'

import { File } from '@app/file/file.entity'
import { FileService } from '@app/file/file.service'
import { Report } from '@app/report/entities/report.entity'
import { ReportService } from '@app/report/services/report.service'
import { Result } from '@app/result/entities/result.entity'

const BATCH_SIZE = 20

type CandidateKind = 'lab' | 'consolidated' | 'upload'

interface Candidate {
  file: File
  kind: CandidateKind
  report: Report | null
}

export interface RecoveryItem {
  id: number
  name: string
  path: string
  reason: string
}

export interface RecoveryError {
  id: number
  path: string
  message: string
}

export interface RecoveryStatus {
  status: 'idle' | 'running' | 'stopping' | 'done' | 'stopped'
  dryRun: boolean
  startedAt: Date | null
  finishedAt: Date | null
  total: number
  checked: number
  present: number
  missing: number
  restored: number
  unrecoverable: RecoveryItem[]
  errors: RecoveryError[]
}

@Injectable()
export class RecoveryService {
  private state: RecoveryStatus = this.createState(false)

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    private readonly fileService: FileService,
    private readonly reportService: ReportService
  ) {}

  private createState(dryRun: boolean): RecoveryStatus {
    return {
      status: 'idle',
      dryRun,
      startedAt: null,
      finishedAt: null,
      total: 0,
      checked: 0,
      present: 0,
      missing: 0,
      restored: 0,
      unrecoverable: [],
      errors: []
    }
  }

  getStatus(): RecoveryStatus {
    return {
      ...this.state,
      unrecoverable: [...this.state.unrecoverable],
      errors: [...this.state.errors]
    }
  }

  start(dryRun: boolean): RecoveryStatus {
    if (this.state.status === 'running' || this.state.status === 'stopping') {
      throw new ConflictException('Восстановление уже запущено')
    }

    this.state = {
      ...this.createState(dryRun),
      status: 'running',
      startedAt: new Date()
    }

    void this.run(this.state)

    return this.getStatus()
  }

  stop(): RecoveryStatus {
    if (this.state.status === 'running') {
      this.state.status = 'stopping'
    }

    return this.getStatus()
  }

  private isStopping(state: RecoveryStatus): boolean {
    return state.status === 'stopping'
  }

  private async run(state: RecoveryStatus): Promise<void> {
    let browser: Browser | null = null

    try {
      const candidates = await this.collectCandidates()
      state.total = candidates.length

      for (let offset = 0; offset < candidates.length; offset += BATCH_SIZE) {
        if (this.isStopping(state)) break

        const batch = candidates.slice(offset, offset + BATCH_SIZE)

        for (const candidate of batch) {
          if (this.isStopping(state)) break

          browser = await this.processCandidate(state, candidate, browser)
        }
      }
    } catch (error: any) {
      state.errors.push({ id: 0, path: '', message: error.message })
    } finally {
      if (browser) {
        await browser.close()
      }
      state.status = this.isStopping(state) ? 'stopped' : 'done'
      state.finishedAt = new Date()
    }
  }

  private async collectCandidates(): Promise<Candidate[]> {
    const candidates = new Map<number, Candidate>()

    const reports = await this.reportRepository.find()

    for (const report of reports) {
      const expressLaboratoryResult = await report.expressLaboratoryResult
      if (expressLaboratoryResult) {
        candidates.set(expressLaboratoryResult.id, {
          file: expressLaboratoryResult,
          kind: 'lab',
          report
        })
      }

      const laboratoryResult = await report.laboratoryResult
      if (laboratoryResult) {
        candidates.set(laboratoryResult.id, {
          file: laboratoryResult,
          kind: 'lab',
          report
        })
      }

      const consolidatedLaboratoryResult =
        await report.consolidatedLaboratoryResult
      if (consolidatedLaboratoryResult) {
        candidates.set(consolidatedLaboratoryResult.id, {
          file: consolidatedLaboratoryResult,
          kind: 'consolidated',
          report
        })
      }
    }

    const uploads = await this.fileRepository
      .createQueryBuilder('file')
      .where('file.path LIKE :pattern', { pattern: 'user/%/upload/%' })
      .getMany()

    for (const file of uploads) {
      if (!candidates.has(file.id)) {
        candidates.set(file.id, { file, kind: 'upload', report: null })
      }
    }

    return [...candidates.values()].sort((a, b) => a.file.id - b.file.id)
  }

  private async processCandidate(
    state: RecoveryStatus,
    candidate: Candidate,
    browser: Browser | null
  ): Promise<Browser | null> {
    const { file, kind, report } = candidate

    state.checked++

    try {
      if (await this.fileService.exists(file.path)) {
        state.present++
        return browser
      }

      state.missing++

      if (kind === 'upload') {
        state.unrecoverable.push(this.toItem(file, 'загрузка пользователя отсутствует, исходника нет'))
        return browser
      }

      if (kind === 'consolidated') {
        state.unrecoverable.push(this.toItem(file, 'сводный протокол, состав не сохранён'))
        return browser
      }

      const result = report?.formNumber
        ? await this.resultRepository.findOneBy({ formNumber: report.formNumber })
        : null

      if (!report || !result) {
        state.unrecoverable.push(this.toItem(file, 'нет результата для протокола'))
        return browser
      }

      if (state.dryRun) {
        return browser
      }

      const instance = browser ?? (await this.reportService.launchBrowser())

      const oilType = await result.oilType
      const html = await this.reportService.buildLabResultHtml(
        report,
        result,
        oilType.standard
      )
      const buffer = await this.reportService.htmlToPdf(html, instance)
      await this.fileService.restore(file, buffer)

      state.restored++

      return instance
    } catch (error: any) {
      state.errors.push({ id: file.id, path: file.path, message: error.message })
      return browser
    }
  }

  private toItem(file: File, reason: string): RecoveryItem {
    return {
      id: file.id,
      name: file.name,
      path: file.path,
      reason
    }
  }
}
