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
type CandidateSlot = 'express' | 'extended' | 'consolidated'

interface Candidate {
  file: File
  kind: CandidateKind
  slot: CandidateSlot
  report: Report
}

export interface RecoveryItem {
  id: number
  name: string
  path: string
  reason: string
  usage: string
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
      const slots: { slot: CandidateSlot; file: File | null | undefined }[] = [
        { slot: 'express', file: await report.expressLaboratoryResult },
        { slot: 'extended', file: await report.laboratoryResult },
        { slot: 'consolidated', file: await report.consolidatedLaboratoryResult }
      ]

      for (const { slot, file } of slots) {
        if (!file || candidates.has(file.id)) continue

        const kind: CandidateKind = file.path.startsWith('user/')
          ? 'upload'
          : slot === 'consolidated'
            ? 'consolidated'
            : 'lab'

        candidates.set(file.id, { file, kind, slot, report })
      }
    }

    return [...candidates.values()].sort((a, b) => a.file.id - b.file.id)
  }

  private async findResult(
    formNumber: string | null,
    standard: boolean
  ): Promise<Result | null> {
    if (!formNumber) return null

    const results = await this.resultRepository.find({
      where: { formNumber },
      order: { updatedAt: 'DESC' }
    })

    for (const result of results) {
      const oilType = await result.oilType
      if (!!oilType?.standard === standard) {
        return result
      }
    }

    return null
  }

  private async processCandidate(
    state: RecoveryStatus,
    candidate: Candidate,
    browser: Browser | null
  ): Promise<Browser | null> {
    const { file, kind, slot, report } = candidate

    state.checked++

    try {
      if (await this.fileService.exists(file.path)) {
        state.present++
        return browser
      }

      state.missing++

      if (kind === 'consolidated' || (kind === 'upload' && slot === 'consolidated')) {
        state.unrecoverable.push(
          await this.toItem(candidate, 'сводный протокол, состав не сохранён')
        )
        return browser
      }

      const standard = slot === 'express'
      const result = await this.findResult(report.formNumber, standard)

      if (!result) {
        state.unrecoverable.push(
          await this.toItem(
            candidate,
            kind === 'upload'
              ? 'загрузка пользователя отсутствует, исходника нет'
              : 'нет подходящего результата'
          )
        )
        return browser
      }

      if (state.dryRun) {
        return browser
      }

      const instance = browser ?? (await this.reportService.launchBrowser())

      const html = await this.reportService.buildLabResultHtml(
        report,
        result,
        standard
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

  private async toItem(candidate: Candidate, reason: string): Promise<RecoveryItem> {
    const { file, kind, slot, report } = candidate

    const reportPart = `Отчёт № ${report.formNumber ?? 'без номера'}`
    const slotLabel =
      slot === 'express'
        ? 'экспресс-протокол'
        : slot === 'extended'
          ? 'расширенный протокол'
          : 'сводный протокол'

    let usage: string
    if (kind === 'upload') {
      const uploader = await file.user
      usage = `Загрузил ${uploader?.name ?? 'неизвестно'} · ${reportPart} · ${slotLabel}`
    } else {
      const client = await report.client
      usage = [reportPart, client?.name, slotLabel].filter(Boolean).join(' · ')
    }

    return {
      id: file.id,
      name: file.name,
      path: file.path,
      reason,
      usage
    }
  }
}
