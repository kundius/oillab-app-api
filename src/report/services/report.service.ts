import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

const wkhtmltopdf = require('wkhtmltopdf')

import { UserService } from '@app/user/services/user.service'
import { VehicleService } from '@app/vehicle/services/vehicle.service'
import { FileService } from '@app/file/file.service'
import { nanoid } from '@app/utils/nanoid'

import * as dto from '../dto/report.dto'
import { Report } from '../entities/report.entity'
import {
  ProductType,
  ReportApplicationForm
} from '../entities/reportApplicationForm.entity'
import { File } from '@app/file/file.entity'
import { User } from '@app/user/entities/user.entity'

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(ReportApplicationForm)
    private readonly applicationFormRepository: Repository<ReportApplicationForm>,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
    private readonly fileService: FileService
  ) {}

  async findById(id: number): Promise<Report | undefined> {
    return await this.reportRepository.findOne(id)
  }

  async findMany(): Promise<Report[]> {
    return await this.reportRepository.find()
  }

  async findByIdOrFail(id: number): Promise<Report> {
    return await this.reportRepository.findOneOrFail(id)
  }

  async getNewNumber(client: User): Promise<number> {
    const lastReport = await this.reportRepository
      .createQueryBuilder('report')
      .andWhere('report.client = :client', {
        client: client.id
      })
      .orderBy('report.number', 'DESC')
      .getOne()

    return (lastReport?.number || 0) + 1
  }

  async create(input: dto.ReportCreateInput) {
    const record = await this.reportRepository.create()
    record.lubricant = input.lubricant
    record.totalMileage = input.totalMileage
    record.lubricantMileage = input.lubricantMileage
    record.samplingNodes = input.samplingNodes
    record.note = input.note || null
    record.color = input.color || null
    record.sampledAt = input.sampledAt
    if (!!input.vehicle) {
      const vehicle = await this.vehicleService.findByIdOrFail(input.vehicle)
      record.vehicle = Promise.resolve(vehicle)
    }
    if (!!input.client) {
      const client = await this.userService.findByIdOrFail(input.client)
      record.client = Promise.resolve(client)
      record.number = await this.getNewNumber(client)
    }
    if (!!input.expressLaboratoryResult) {
      const expressLaboratoryResult = await this.fileService.findByIdOrFail(
        input.expressLaboratoryResult
      )
      record.expressLaboratoryResult = Promise.resolve(expressLaboratoryResult)
    }
    if (!!input.laboratoryResult) {
      const laboratoryResult = await this.fileService.findByIdOrFail(
        input.laboratoryResult
      )
      record.laboratoryResult = Promise.resolve(laboratoryResult)
    }
    await this.reportRepository.save(record)
    return record
  }

  async update(record: Report, input: dto.ReportUpdateInput) {
    if (typeof input.lubricant !== 'undefined') {
      record.lubricant = input.lubricant
    }
    if (typeof input.totalMileage !== 'undefined') {
      record.totalMileage = input.totalMileage
    }
    if (typeof input.lubricantMileage !== 'undefined') {
      record.lubricantMileage = input.lubricantMileage
    }
    if (typeof input.samplingNodes !== 'undefined') {
      record.samplingNodes = input.samplingNodes
    }
    if (typeof input.note !== 'undefined') {
      record.note = input.note
    }
    if (typeof input.color !== 'undefined') {
      record.color = input.color
    }
    if (typeof input.sampledAt !== 'undefined') {
      record.sampledAt = input.sampledAt
    }
    if (typeof input.client !== 'undefined') {
      if (input.client === null) {
        record.client = Promise.resolve(null)
        record.number = null
      } else {
        const client = await this.userService.findByIdOrFail(input.client)
        if (client.id !== (await record.client)?.id) {
          record.client = Promise.resolve(client)
          record.number = await this.getNewNumber(client)
        }
      }
    }
    if (typeof input.vehicle !== 'undefined') {
      if (input.vehicle === null) {
        record.vehicle = Promise.resolve(null)
      } else {
        const vehicle = await this.vehicleService.findByIdOrFail(input.vehicle)
        record.vehicle = Promise.resolve(vehicle)
      }
    }
    if (typeof input.expressLaboratoryResult !== 'undefined') {
      if (input.expressLaboratoryResult === null) {
        record.expressLaboratoryResult = Promise.resolve(null)
      } else {
        const expressLaboratoryResult = await this.fileService.findByIdOrFail(
          input.expressLaboratoryResult
        )
        record.expressLaboratoryResult = Promise.resolve(
          expressLaboratoryResult
        )
      }
    }
    if (typeof input.laboratoryResult !== 'undefined') {
      if (input.laboratoryResult === null) {
        record.laboratoryResult = Promise.resolve(null)
      } else {
        const laboratoryResult = await this.fileService.findByIdOrFail(
          input.laboratoryResult
        )
        record.laboratoryResult = Promise.resolve(laboratoryResult)
      }
    }
    await this.reportRepository.save(record)
    return record
  }

  async delete(record: Report) {
    await this.reportRepository.remove(record)
  }

  async paginateForUser(
    args: dto.ReportPaginateArgs,
    user: User
  ): Promise<dto.ReportPaginateResponse> {
    const { page, perPage, filter, sort } = args

    const qb = this.reportRepository.createQueryBuilder('report')

    qb.andWhere('report.client = :onlySelfId', {
      onlySelfId: user.id
    })

    if (filter) {
      this.applyFilter(qb, filter)
    }

    if (sort) {
      this.applySort(qb, sort)
    }

    const total = await qb.getCount()
    const items = await qb
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany()

    return {
      items,
      pageInfo: {
        total,
        page,
        perPage
      }
    }
  }

  async paginate(
    args: dto.ReportPaginateArgs,
    forUser?: User
  ): Promise<dto.ReportPaginateResponse> {
    const { page, perPage, filter, sort } = args

    const qb = this.reportRepository.createQueryBuilder('report')

    if (forUser) {
      qb.andWhere('report.client = :onlySelfId', {
        onlySelfId: forUser.id
      })
    }

    if (filter) {
      this.applyFilter(qb, filter)
    }

    if (sort) {
      this.applySort(qb, sort)
    }

    const total = await qb.getCount()
    const items = await qb
      .skip((page - 1) * perPage)
      .take(perPage)
      .getMany()

    return {
      items,
      pageInfo: {
        total,
        page,
        perPage
      }
    }
  }

  applySort(
    qb: SelectQueryBuilder<Report>,
    sort: dto.ReportSort[]
  ): SelectQueryBuilder<Report> {
    for (const value of sort) {
      switch (value) {
        case dto.ReportSort.LUBRICANT_ASC:
          qb.orderBy('report.lubricant', 'ASC')
          break
        case dto.ReportSort.LUBRICANT_DESC:
          qb.orderBy('report.lubricant', 'DESC')
          break
        case dto.ReportSort.LUBRICANT_MILEAGE_ASC:
          qb.orderBy('report.lubricantMileage', 'ASC')
          break
        case dto.ReportSort.LUBRICANT_MILEAGE_DESC:
          qb.orderBy('report.lubricantMileage', 'DESC')
          break
        case dto.ReportSort.SAMPLED_AT_ASC:
          qb.orderBy('report.sampledAt', 'ASC')
          break
        case dto.ReportSort.SAMPLED_AT_DESC:
          qb.orderBy('report.sampledAt', 'DESC')
          break
        case dto.ReportSort.SAMPLING_NODES_ASC:
          qb.orderBy('report.samplingNodes', 'ASC')
          break
        case dto.ReportSort.SAMPLING_NODES_DESC:
          qb.orderBy('report.samplingNodes', 'DESC')
          break
        case dto.ReportSort.TOTAL_MILEAGE_ASC:
          qb.orderBy('report.totalMileage', 'ASC')
          break
        case dto.ReportSort.TOTAL_MILEAGE_DESC:
          qb.orderBy('report.totalMileage', 'DESC')
          break
        case dto.ReportSort.ID_ASC:
          qb.orderBy('report.id', 'ASC')
          break
        case dto.ReportSort.ID_DESC:
          qb.orderBy('report.id', 'DESC')
          break
        case dto.ReportSort.NUMBER_ASC:
          qb.orderBy('report.number', 'ASC')
          break
        case dto.ReportSort.NUMBER_DESC:
          qb.orderBy('report.number', 'DESC')
          break
        case dto.ReportSort.COLOR_ASC:
          qb.orderBy('report.color', 'ASC')
          break
        case dto.ReportSort.COLOR_DESC:
          qb.orderBy('report.color', 'DESC')
          break
        default:
          throw new Error('Not implemented')
      }
    }
    return qb
  }

  applyFilter(
    qb: SelectQueryBuilder<Report>,
    filter: dto.ReportFilter
  ): SelectQueryBuilder<Report> {
    if (filter.color) {
      if (filter.color.eq) {
        qb.andWhere('report.color LIKE :colorEq', {
          colorEq: filter.color.eq
        })
      }
      if (filter.color.contains) {
        qb.andWhere('report.color LIKE :colorContains', {
          colorContains: `%${filter.color.contains}%`
        })
      }
    }
    if (filter.lubricant) {
      if (filter.lubricant.eq) {
        qb.andWhere('report.lubricant LIKE :lubricantEq', {
          lubricantEq: filter.lubricant.eq
        })
      }
      if (filter.lubricant.contains) {
        qb.andWhere('report.lubricant LIKE :lubricantContains', {
          lubricantContains: `%${filter.lubricant.contains}%`
        })
      }
    }
    if (filter.totalMileage) {
      if (filter.totalMileage.eq) {
        qb.andWhere('report.totalMileage LIKE :totalMileageEq', {
          totalMileageEq: filter.totalMileage.eq
        })
      }
      if (filter.totalMileage.contains) {
        qb.andWhere('report.totalMileage LIKE :totalMileageContains', {
          totalMileageContains: `%${filter.totalMileage.contains}%`
        })
      }
    }
    if (filter.lubricantMileage) {
      if (filter.lubricantMileage.eq) {
        qb.andWhere('report.lubricantMileage LIKE :lubricantMileageEq', {
          lubricantMileageEq: filter.lubricantMileage.eq
        })
      }
      if (filter.lubricantMileage.contains) {
        qb.andWhere('report.lubricantMileage LIKE :lubricantMileageContains', {
          lubricantMileageContains: `%${filter.lubricantMileage.contains}%`
        })
      }
    }
    if (filter.samplingNodes) {
      if (filter.samplingNodes.eq) {
        qb.andWhere('report.samplingNodes LIKE :samplingNodesEq', {
          samplingNodesEq: filter.samplingNodes.eq
        })
      }
      if (filter.samplingNodes.contains) {
        qb.andWhere('report.samplingNodes LIKE :samplingNodesContains', {
          samplingNodesContains: `%${filter.samplingNodes.contains}%`
        })
      }
    }
    if (filter.sampledAt) {
      if (filter.sampledAt.eq) {
        qb.andWhere('report.sampledAt = :sampledAtEq', {
          sampledAtEq: filter.sampledAt.eq
        })
      }
      if (filter.sampledAt.lt) {
        qb.andWhere('report.sampledAt < :sampledAtLt', {
          sampledAtLt: filter.sampledAt.lt
        })
      }
      if (filter.sampledAt.gt) {
        qb.andWhere('report.sampledAt > :sampledAtGt', {
          sampledAtGt: filter.sampledAt.gt
        })
      }
    }
    if (filter.id) {
      if (filter.id.eq) {
        qb.andWhere('report.id = :idEq', {
          idEq: filter.id.eq
        })
      }
      if (filter.id.lt) {
        qb.andWhere('report.id < :idLt', {
          idLt: filter.id.lt
        })
      }
      if (filter.id.gt) {
        qb.andWhere('report.id > :idGt', {
          idGt: filter.id.gt
        })
      }
    }
    if (filter.clientName) {
      if (filter.clientName.eq) {
        qb.leftJoin('report.client', 'client').andWhere(
          'client.name LIKE :clientNameEq',
          {
            clientNameEq: filter.clientName.eq
          }
        )
      }
      if (filter.clientName.contains) {
        qb.leftJoin('report.client', 'client').andWhere(
          'client.name LIKE :clientNameContains',
          {
            clientNameContains: `%${filter.clientName.contains}%`
          }
        )
      }
    }
    if (filter.vehicleModel) {
      if (filter.vehicleModel.eq) {
        qb.leftJoin('report.vehicle', 'vehicle').andWhere(
          'vehicle.model LIKE :vehicleModelEq',
          {
            vehicleModelEq: filter.vehicleModel.eq
          }
        )
      }
      if (filter.vehicleModel.contains) {
        qb.leftJoin('report.vehicle', 'vehicle').andWhere(
          'vehicle.model LIKE :vehicleModelContains',
          {
            vehicleModelContains: `%${filter.vehicleModel.contains}%`
          }
        )
      }
    }
    if (filter.vehicleEngineModel) {
      if (filter.vehicleEngineModel.eq) {
        qb.leftJoin('report.vehicle', 'vehicle').andWhere(
          'vehicle.engineModel LIKE :vehicleEngineModelEq',
          {
            vehicleEngineModelEq: filter.vehicleEngineModel.eq
          }
        )
      }
      if (filter.vehicleEngineModel.contains) {
        qb.leftJoin('report.vehicle', 'vehicle').andWhere(
          'vehicle.engineModel LIKE :vehicleEngineModelContains',
          {
            vehicleEngineModelContains: `%${filter.vehicleEngineModel.contains}%`
          }
        )
      }
    }
    if (filter.vehicleReleaseYear) {
      if (filter.vehicleReleaseYear.eq) {
        qb.leftJoin('report.vehicle', 'vehicle').andWhere(
          'vehicle.releaseYear LIKE :vehicleReleaseYearEq',
          {
            vehicleReleaseYearEq: filter.vehicleReleaseYear.eq
          }
        )
      }
      if (filter.vehicleReleaseYear.contains) {
        qb.leftJoin('report.vehicle', 'vehicle').andWhere(
          'vehicle.releaseYear LIKE :vehicleReleaseYearContains',
          {
            vehicleReleaseYearContains: `%${filter.vehicleReleaseYear.contains}%`
          }
        )
      }
    }
    if (filter.vehicleStateNumber) {
      if (filter.vehicleStateNumber.eq) {
        qb.leftJoin('report.vehicle', 'vehicle').andWhere(
          'vehicle.stateNumber LIKE :vehicleStateNumberEq',
          {
            vehicleStateNumberEq: filter.vehicleStateNumber.eq
          }
        )
      }
      if (filter.vehicleStateNumber.contains) {
        qb.leftJoin('report.vehicle', 'vehicle').andWhere(
          'vehicle.stateNumber LIKE :vehicleStateNumberContains',
          {
            vehicleStateNumberContains: `%${filter.vehicleStateNumber.contains}%`
          }
        )
      }
    }
    return qb
  }

  async generatePdf(
    filter?: dto.ReportFilter,
    sort?: dto.ReportSort[],
    forUser?: User
  ): Promise<File> {
    const qb = this.reportRepository.createQueryBuilder('report')

    if (forUser) {
      qb.andWhere('report.client = :onlySelfId', {
        onlySelfId: forUser.id
      })
    }

    if (filter) {
      this.applyFilter(qb, filter)
    }

    if (sort) {
      this.applySort(qb, sort)
    }

    const items = await qb.getMany()

    const itemsHtml: string[] = []
    for (const item of items) {
      const client = await item.client
      const vehicle = await item.vehicle
      itemsHtml.push(`
        <tr>
          <td>${item.id}</td>
          <td>${client?.name || '-'}</td>
          <td>${vehicle?.model || '-'}</td>
          <td>${vehicle?.stateNumber || '-'}</td>
          <td>${item.totalMileage}</td>
          <td>${item.lubricantMileage}</td>
          <td>${item.samplingNodes}</td>
          <td>${item.lubricant}</td>
          <td>${item.sampledAt.toLocaleDateString()}</td>
          <td>${item.note}</td>
        </tr>
      `)
    }
    const html = `
      <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=PT+Serif:wght@400;700&display=swap" rel="stylesheet">
      <style>
        table {
          font-size: 10px;
          font-family: 'PT Serif', serif;
          width: 100%;
          border: 1px solid #e1e6eb;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          background: #f3f4f7;
          padding: 2px;
          border: 1px solid #e1e6eb;
        }
        td {
          padding: 2px;
          border: 1px solid #e1e6eb;
        }
      </style>
      <table>
        <tr>
          <th>Номер</th>
          <th>Владелец техники</th>
          <th>Модель</th>
          <th>Гос. номер</th>
          <th>Общий пробег</th>
          <th>Пробег на смазочном материале</th>
          <th>Узел пробоотбора</th>
          <th>Смазочный материал</th>
          <th>Дата пробы</th>
          <th>Примечание</th>
        </tr>
        ${itemsHtml.join('')}
      </table>
    `

    async function getPdf(html: string): Promise<Buffer> {
      return new Promise<Buffer>((resolve, reject) => {
        wkhtmltopdf(
          html,
          {
            marginLeft: 0,
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            encoding: 'utf8',
            disableSmartShrinking: true
          },
          function (err, stream) {
            const _buf = Array<any>()
            stream.on('data', (chunk) => _buf.push(chunk))
            stream.on('end', () => resolve(Buffer.concat(_buf)))
            stream.on('error', (err) => reject(`error converting stream - ${err}`))
          }
        )
      })
    }

    return await this.fileService.uploadAndCreateFile({
      buffer: await getPdf(html),
      dir: 'report/pdf',
      name: nanoid()
    })
  }

  async updateApplicationForm(
    report: Report,
    input: dto.ReportUpdateApplicationFormInput
  ): Promise<Report> {
    let applicationForm = await report.applicationForm
    if (!applicationForm) {
      applicationForm = await this.applicationFormRepository.create()
      // report.applicationForm = Promise.resolve(applicationForm)
      applicationForm.report = Promise.resolve(report)
      // await this.reportRepository.save(report)
    }
    for (let key of Object.keys(input)) {
      applicationForm[key] = input[key]
    }
    await this.applicationFormRepository.save(applicationForm)
    return report
  }

  getProductTypeLabel(type?: ProductType | null) {
    if (type === ProductType.Coolant) {
      return 'Т'
    }
    if (type === ProductType.Fuel) {
      return 'ОЖ'
    }
    if (type === ProductType.Oil) {
      return 'СМ'
    }
    return type
  }

  async getApplicationFormNumber(report: Report): Promise<string | undefined> {
    const applicationForm = await report.applicationForm
    const client = await report.client
    const vehicle = await report.vehicle
    const productType = this.getProductTypeLabel(applicationForm?.productType)
    const numberArr = [
      productType || 'X',
      client?.name || 'X',
      vehicle?.model || 'X',
      report?.totalMileage || 'X',
      report?.sampledAt.toLocaleDateString('ru-RU') || 'X'
    ]
    const number = numberArr.join(' - ')
    return number
  }
}
