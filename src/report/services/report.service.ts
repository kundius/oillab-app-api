import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'

const wkhtmltopdf = require('wkhtmltopdf')

import { UserService } from '@app/user/services/user.service'
import { LubricantService } from '@app/lubricant/services/lubricant.service'
import { VehicleService } from '@app/vehicle/services/vehicle.service'
import { FileService } from '@app/file/file.service'
import { nanoid } from '@app/utils/nanoid'

import * as dto from '../dto/report.dto'
import { Report, ReportColor } from '../entities/report.entity'
import { File } from '@app/file/file.entity'
import { User } from '@app/user/entities/user.entity'
import { ProductType } from '@app/lubricant/entities/lubricant.entity'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ReportService {
  tableName = 'report'

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly userService: UserService,
    private readonly lubricantService: LubricantService,
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

    return this.update(record, input)
  }

  async update(record: Report, input: dto.ReportUpdateInput) {
    const {
      color,
      client,
      vehicle,
      expressLaboratoryResult,
      laboratoryResult,
      lubricantEntityId,
      ...data
    } = input

    for (let key of Object.keys(data)) {
      record[key] = data[key]
    }

    if (typeof color !== 'undefined') {
      record.color = color in ReportColor ? color : null
    }

    if (typeof client !== 'undefined') {
      if (client === null) {
        record.client = Promise.resolve(null)
        record.number = null
      } else {
        const clientEntity = await this.userService.findByIdOrFail(client)
        if (clientEntity.id !== (await record.client)?.id) {
          record.client = Promise.resolve(clientEntity)
          record.number = await this.getNewNumber(clientEntity)
        }
      }
    }

    if (typeof vehicle !== 'undefined') {
      if (vehicle === null) {
        record.vehicle = Promise.resolve(null)
      } else {
        const vehicleEntity = await this.vehicleService.findByIdOrFail(vehicle)
        record.vehicle = Promise.resolve(vehicleEntity)
      }
    }

    if (typeof lubricantEntityId !== 'undefined') {
      if (lubricantEntityId === null) {
        record.lubricantEntity = Promise.resolve(null)
      } else {
        const lubricantEntity = await this.lubricantService.findByIdOrFail(
          lubricantEntityId
        )
        record.lubricantEntity = Promise.resolve(lubricantEntity)
      }
    }

    if (typeof expressLaboratoryResult !== 'undefined') {
      if (expressLaboratoryResult === null) {
        record.expressLaboratoryResult = Promise.resolve(null)
      } else {
        const expressLaboratoryResultEntity =
          await this.fileService.findByIdOrFail(expressLaboratoryResult)
        record.expressLaboratoryResult = Promise.resolve(
          expressLaboratoryResultEntity
        )
      }
    }

    if (typeof laboratoryResult !== 'undefined') {
      if (laboratoryResult === null) {
        record.laboratoryResult = Promise.resolve(null)
      } else {
        const laboratoryResultEntity = await this.fileService.findByIdOrFail(
          laboratoryResult
        )
        record.laboratoryResult = Promise.resolve(laboratoryResultEntity)
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
      let arr = value.split('_') as [string, 'ASC' | 'DESC']
      qb.orderBy(`${this.tableName}.${arr[0]}`, arr[1])
    }
    return qb
  }

  applyFilter(
    qb: SelectQueryBuilder<Report>,
    filter: dto.ReportFilter
  ): SelectQueryBuilder<Report> {
    let classFilter = plainToClass(dto.ReportFilter, filter)
    classFilter.applyFilter(this.tableName, qb)
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
      const lubricant = await item.lubricantEntity
      itemsHtml.push(`
        <tr>
          <td>${item.id}</td>
          <td>${client?.name || '-'}</td>
          <td>${vehicle?.model || '-'}</td>
          <td>${vehicle?.stateNumber || '-'}</td>
          <td>${item.totalMileage}</td>
          <td>${item.lubricantMileage}</td>
          <td>${item.samplingNodes}</td>
          <td>${lubricant?.brand} / ${lubricant?.model} / ${lubricant?.viscosity}</td>
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
            stream.on('error', (err) =>
              reject(`error converting stream - ${err}`)
            )
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

  getProductTypeLabel(type?: ProductType | null) {
    if (type === ProductType.Coolant) {
      return 'ОЖ'
    }
    if (type === ProductType.Fuel) {
      return 'Т'
    }
    if (type === ProductType.Oil) {
      return 'СМ'
    }
    return type
  }

  async getApplicationFormNumber(report: Report): Promise<string | undefined> {
    const lubricant = await report.lubricantEntity
    const client = await report.client
    const vehicle = await report.vehicle
    const productType = this.getProductTypeLabel(lubricant?.productType)
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
