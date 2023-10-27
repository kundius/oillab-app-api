import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { configService } from '@app/config/config.service'

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
import { Result } from '@app/result/entities/result.entity'
import { OilType } from '@app/oil-type/entities/oil-type.entity'

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

  async isFormNumberExists(formNumber: string): Promise<boolean> {
    return !!(await this.reportRepository.findOne({ formNumber }))
  }

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
      oilTypeId,
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
    if (typeof oilTypeId !== 'undefined') {
      if (oilTypeId === null) {
        record.oilType = Promise.resolve(null)
      } else {
        const oilType = await OilType.findOneOrFail(oilTypeId)
        record.oilType = Promise.resolve(oilType)
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
          <td>${lubricant?.brand} / ${lubricant?.model} / ${
        lubricant?.viscosity
      }</td>
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

  async getResultStream(
    report: Report,
    result: Result
  ): Promise<NodeJS.ReadableStream> {
    const getSelectionTitle = () => {
      if (lubricant?.productType === ProductType.Coolant) {
        return 'Информация об отборе образца охлаждающей жидкотсти:'
      }
      if (lubricant?.productType === ProductType.Fuel) {
        return 'Информация об отборе образца топлива:'
      }
      if (lubricant?.productType === ProductType.Oil) {
        return 'Информация об отборе образца масла:'
      }
      return 'Информация об отборе образца:'
    }

    const lubricant = await report?.lubricantEntity
    const vehicle = await report?.vehicle
    const customer = await report?.client
    const productType = this.getProductTypeLabel(lubricant?.productType)
    const number = await this.getApplicationFormNumber(report)

    const html = `
      <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=PT+Serif:wght@400;700&display=swap" rel="stylesheet">
      <style>
        html, body {
          font-size: 16px;
          font-family: 'PT Serif', serif;
        }
        body {
          padding: 1rem;
        }
        hr {
          height: 0.5rem;
          border: none;
          display: block;
          background: #4f81bd;
          margin: 1rem 0;
        }
        table {
          width: 100%;
          border: none;
          border-collapse: collapse;
        }
        th {
        }
        td {
          vertical-align: top;
        }
        .pagebreak {
          page-break-before: always;
          height: 1rem;
        }
        .screen {
          page-break-after: always;
          min-height: 297mm;
          box-sizing: border-box;
          padding: 20px;
        }
        .title-normal {
          font-size: 1.25rem;
          line-height: 1;
          font-weight: bold;
          margin: 1rem 0;
        }
        .title-small {
          font-size: 1rem;
          line-height: 1;
          font-weight: bold;
          margin: 1rem 0;
        }
        .field {
          display: -webkit-box;
          display: flex;
        }
        .field_vertical {
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -webkit-flex-direction: column;
        }
        .field__label {
          font-size: 1rem;
          line-height: 1.5rem;
          margin-right: 0.75rem;
        }
        .field__label_large {
          font-size: 1.25rem;
          font-weight: bold;
        }
        .field__input {
          flex-grow: 1;
          -webkit-box-flex: 1;
          -webkit-flex-grow: 1;
          font-size: 1rem;
          line-height: 1.5rem;
          min-height: 1.5rem;
          position: relative;
          overflow: hidden;
          font-weight: bold;
        }
        .field__input::before {
          content: '';
          position: absolute;
          left: 0;
          top: 1.5rem;
          margin-top: -1px;
          width: 100%;
          height: 1.5rem;
          border-top: 1px solid currentColor;
          border-bottom: 1px solid currentColor;
          box-sizing: border-box;
        }
        .field__input::after {
          content: '';
          position: absolute;
          left: 0;
          top: 4.5rem;
          margin-top: -1px;
          width: 100%;
          height: 1.5rem;
          border-top: 1px solid currentColor;
          border-bottom: 1px solid currentColor;
          box-sizing: border-box;
        }
        .fields {
          margin-left: -1.5rem;
          margin-right: -1.5rem;
          margin-top: -0.75rem;
          margin-bottom: -0.75rem;
        }
        .fields table {
          border-collapse: separate;
          border-spacing: 1.5rem 0.75rem;
        }
      </style>
      <table style="font-size: 1rem">
        <tr>
          <td>
            <img src="${configService.getOrigin()}/images/logo.png" width="200" height="90" />
          </td>
          <td style="text-align: center; vertical-align: middle">
            Испытательная лаборатория (центр)<br />
            Общество с Ограниченной Ответственностью<br />
            <strong>«OILLAB»</strong>
          </td>
          <td style="text-align: right">
            <img src="${configService.getOrigin()}/images/qr-code.png" width="90" height="90" />
          </td>
        </tr>
        <tr>
          <td colspan="3" style="height: 1rem"></td>
        </tr>
        <tr>
          <td colspan="2">
            Воронежская область, город Воронеж, Ленинский проспект, дом 156в<br />
            8-962-328-89-16
          </td>
          <td style="text-align: right">
            oillabvrn@yandex.ru<br />
            www.oillabvrn.ru
          </td>
        </tr>
      </table>
  
      <hr />
  
      <div class="fields">
        <table>
          <tr>
            <td width="50%">
              <div class="field field_vertical">
                <div class="field__label">
                  ПРОТОКОЛ РЕЗУЛЬТАТОВ ИЗМЕРЕНИЙ
                </div>
                <div class="field__input">
                  № ${report.formNumber} от ${report.createdAt.toLocaleDateString('ru-RU')}
                </div>
              </div>
            </td>
            <td width="50%">
              <div class="field field_vertical">
                <div class="field__label">
                  НОМЕР ОБРАЗЦА ЗАКАЗЧИКА
                </div>
                <div class="field__input">
                  ${number}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
  
      <hr />
  
      <div class="title-normal">
        Данные владельца техники / заказчика
      </div>
  
      <div class="fields">
        <table>
          <tr>
            <td>
              <div class="field">
                <div class="field__label">
                  Организация
                </div>
                <div class="field__input">
                  ${customer?.name || ''}
                </div>
              </div>
            </td>
            <td>
              <div class="field">
                <div class="field__label">
                  Контактный телефон
                </div>
                <div class="field__input">
                  ${customer?.phone || ''}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="field">
                <div class="field__label">
                  Контактное лицо
                </div>
                <div class="field__input">
                  ${customer?.contactPerson || ''}
                </div>
              </div>
            </td>
            <td>
              <div class="field">
                <div class="field__label">
                  Электронная почта
                </div>
                <div class="field__input">
                  ${customer?.email || ''}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
  
      <hr />
  
      <div class="title-normal">
        Техника / точка отбора образца
      </div>
  
      <div class="fields">
        <table>
          <tr>
            <td colspan="2">
              <div class="field">
                <div class="field__label">
                  Производитель оборудования
                </div>
                <div class="field__input">
                  ${vehicle?.model || ''}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="field">
                <div class="field__label">
                  Регистрационный номер
                </div>
                <div class="field__input">
                  ${vehicle?.stateNumber || ''}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="field">
                <div class="field__label">
                  Модель оборудования
                </div>
                <div class="field__input">
                  ${vehicle?.engineModel || ''}
                </div>
              </div>
            </td>
            <td>
              <div class="field">
                <div class="field__label">
                  Год выпуска
                </div>
                <div class="field__input">
                  ${vehicle?.releaseYear || ''}
                </div>
              </div>
            </td>
          </tr>
        </table>
        </div>
  
        <div class="fields">
        <table>
          <tr>
            <td>
              <div class="field">
                <div class="field__label">
                  Общая наработка узла
                </div>
                <div class="field__input">
                  ${report?.totalMileage || ''}
                </div>
              </div>
            </td>
            <td>
              <div class="field">
                <div class="field__label">
                  Объём жидкости в оборудовании
                </div>
                <div class="field__input">
                  ${vehicle?.liquidVolume || ''}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="field">
                <div class="field__label">
                  Общая наработка на СМ
                </div>
                <div class="field__input">
                  ${report?.lubricantMileage || ''}
                </div>
              </div>
            </td>
            <td>
              <div class="field">
                <div class="field__label">
                  Долив СМ
                </div>
                <div class="field__input">
                  ${report?.vehicleToppingUpLubricant || ''}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
  
      <hr />
  
      <div class="title-normal">
        Информация о смазочном материале
      </div>
  
      <div class="fields">
        <table>
          <tr>
            <td>
              <div class="field">
                <div class="field__label">
                Бренд СМ
                </div>
                <div class="field__input">
                  ${lubricant?.brand || ''}
                </div>
              </div>
            </td>
            <td>
              <div class="field">
                <div class="field__label">
                Вязкость
                </div>
                <div class="field__input">
                  ${lubricant?.viscosity || ''}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="field">
                <div class="field__label">
                Марка СМ
                </div>
                <div class="field__input">
                  ${lubricant?.model || ''}
                </div>
              </div>
            </td>
            <td>
              <div class="field">
                <div class="field__label">
                Состояние СМ
                </div>
                <div class="field__input">
                  ${report?.lubricantState || ''}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="pagebreak"></div>

      <hr />

      <div class="title-small">
        ${getSelectionTitle()}
      </div>

      <div class="fields">
        <table>
          <tr>
            <td colspan="2">
              <div class="field">
                <div class="field__label">
                Номер образца
                </div>
                <div class="field__input">
                ${number}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="width: 50%">
              <div class="field">
                <div class="field__label">
                  Вид
                </div>
                <div class="field__input">
                  ${productType || ''}
                </div>
              </div>
            </td>
            <td>
              <div class="field">
                <div class="field__label">
                  Объём образца
                </div>
                <div class="field__input">
                  ${report?.selectionVolume || ''}
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="field">
                <div class="field__label">
                  Бренд
                </div>
                <div class="field__input">
                  ${lubricant?.brand || ''}
                </div>
              </div>
            </td>
            <td>
              <div class="field">
                <div class="field__label">
                Место отбора пробы
                </div>
                <div class="field__input">
                  ${report?.samplingNodes || ''}
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="title-small" style="margin-bottom: 0">
        Примечание:
      </div>

      <div class="field">
        <div class="field__input" style="min-height: 4rem">
          ${report?.note || ''}
        </div>
      </div>
    `

    return wkhtmltopdf(html, {
      marginLeft: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      encoding: 'utf8',
      disableSmartShrinking: true
    })
  }

  async getResultBuffer(
    report: Report,
    result: Result
  ): Promise<Buffer> {
    const stream = await this.getResultStream(report, result)

    return new Promise<Buffer>((resolve, reject) => {
      const _buf = Array<any>()
      stream.on('data', (chunk) => _buf.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(_buf)))
      stream.on('error', (err) =>
        reject(`error converting stream - ${err}`)
      )
    })
  }

  async getResultFile(
    report: Report,
    result: Result
  ): Promise<File> {
    const buffer = await this.getResultBuffer(report, result)

    const file = await this.fileService.uploadAndCreateFile({
      buffer,
      dir: 'result/pdf',
      name: nanoid()
    })

    return file
  }
}
