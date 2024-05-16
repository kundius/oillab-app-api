import {
  Controller,
  Get,
  Header,
  UseGuards,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  Param,
  Res,
  BadRequestException,
  StreamableFile
} from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { configService } from '@app/config/config.service'
import { CurrentUser } from '@app/auth/CurrentUser'
import { User, UserRole } from '@app/user/entities/user.entity'
import { ProductType } from '@app/lubricant/entities/lubricant.entity'
import { ReportService } from '../services/report.service'
import { Result } from '@app/result/entities/result.entity'

const wkhtmltopdf = require('wkhtmltopdf')

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/applicationForm')
  @Header('Content-Type', 'application/pdf')
  // @Header('Content-Disposition', 'attachment; filename=applicationForm.pdf')
  async applicationForm(
    @Param('id') id: string,
    @Res() response: Response,
    @CurrentUser() currentUser?: User
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException()
    }

    if (currentUser.role !== UserRole.Administrator) {
      throw new ForbiddenException()
    }

    const report = await this.reportService.findById(parseInt(id))

    if (!report) {
      throw new NotFoundException()
    }

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
    const productType = this.reportService.getProductTypeLabel(
      lubricant?.productType
    )
    const number = await this.reportService.getApplicationFormNumber(report)

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

      <div class="field">
        <div class="field__label field__label_large">
          №&nbsp;образца
        </div>
        <div class="field__input">
          ${number}
        </div>
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

    wkhtmltopdf(html, {
      marginLeft: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      encoding: 'utf8',
      disableSmartShrinking: true
    }).pipe(response)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/result')
  @Header('Content-Type', 'application/pdf')
  // @Header('Content-Disposition', 'attachment; filename=result.pdf')
  async result(
    @Param('id') id: string,
    @Res() response: Response,
    @CurrentUser() currentUser?: User
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException()
    }

    if (currentUser.role !== UserRole.Administrator) {
      throw new ForbiddenException()
    }

    const report = await this.reportService.findById(parseInt(id))

    if (!report) {
      throw new NotFoundException()
    }

    if (!report.formNumber) {
      throw new BadRequestException()
    }

    const result = await Result.findOneBy({
      formNumber: report.formNumber
    })

    if (!result) {
      throw new NotFoundException()
    }

    const stream = await this.reportService.getResultStream(report, result)

    stream.pipe(response)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/registrationSticker')
  @Header('Content-Type', 'application/pdf')
  // @Header('Content-Disposition', 'attachment; filename=registrationSticker.pdf')
  async registrationSticker(
    @Param('id') id: string,
    @Res() response: Response,
    @CurrentUser() currentUser?: User
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException()
    }

    if (currentUser.role !== UserRole.Administrator) {
      throw new ForbiddenException()
    }

    const report = await this.reportService.findById(parseInt(id))

    if (!report) {
      throw new NotFoundException()
    }

    const client = await report.client
    const lubricant = await report.lubricantEntity
    const vehicle = await report.vehicle
    const productType = this.reportService.getProductTypeLabel(
      lubricant?.productType
    )
    const sampledAt = report?.sampledAt.toLocaleDateString('ru-RU')
    const number = await this.reportService.getApplicationFormNumber(report)

    const style = `

    <style>
    <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=PT+Serif:wght@400;700&display=swap" rel="stylesheet">
    html, body {
      font-size: 16px;
      padding: 0;
      font-family: 'PT Sans', sans-serif;
    }
      table {
        width: 100%;
        border: none;
        border-collapse: collapse;
      }
      td {
        padding: 0.75rem;
      }
      .sticker {
        padding: 0.75rem;
        border: 1px solid #000000;
        width: 340px;
        height: 170px;
      }
      .value {
        font-size: 0.75rem;
        line-height: 1rem;
      }
      * + .value {
        margin-top: .25rem;
      }
      .group-value {
        margin-left: -1rem;
      }
      .group-value::after {
        content: '';
        display: table;
        clear: both;
      }
      * + .group-value {
        margin-top: .25rem;
      }
      .group-value__item {
        font-size: 0.75rem;
        line-height: 1rem;
        padding-left: 1rem;
        float: left;
      }
      .number {
        font-weight: 700;
        font-size: 18px;
      }
    </style>
    `

    const sticker = `
    <div class="sticker">
      <div class="group-value">
        <div class="group-value__item">
          № <span class="number">${report.formNumber}</span>
        </div>
        <div class="group-value__item">
          Дата отбора пробы ${sampledAt}
        </div>
      </div>
      <div class="value">
      ${client?.name}
      </div>
      <div class="value">
      ${lubricant?.brand} ${lubricant?.model} ${lubricant?.viscosity}
      </div>
      <div class="value">
      ${vehicle?.model}
      </div>
      <div class="value">
      ${vehicle?.stateNumber}
      </div>
      <div class="value">
      ${report?.totalMileage}
      </div>
      <div class="value">
      ${report?.note}
      </div>
    </div>
    `

    const html = `
    ${style}
    <table>
      <tr>
        <td width="50%">
          ${sticker}
        </td>
        <td width="50%">
          ${sticker}
        </td>
      </tr>
      <tr>
        <td width="50%">
          ${sticker}
        </td>
        <td width="50%">
          ${sticker}
        </td>
      </tr>
    </table>
    `

    wkhtmltopdf(html, {
      marginLeft: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      encoding: 'utf8',
      dpi: 300,
      disableSmartShrinking: true
    }).pipe(response)
  }
}
