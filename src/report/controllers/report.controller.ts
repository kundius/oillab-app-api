import {
  Controller,
  Get,
  Header,
  UseGuards,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  Param,
  Res
} from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { configService } from '@app/config/config.service'
import { CurrentUser } from '@app/auth/CurrentUser'
import { User, UserRole } from '@app/user/entities/user.entity'
import { ProductType } from '../entities/reportApplicationForm.entity'
import { ReportService } from '../services/report.service'

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
      if (applicationForm?.productType === ProductType.Coolant) {
        return 'Информация об отборе образца охлаждающей жидкотсти:'
      }
      if (applicationForm?.productType === ProductType.Fuel) {
        return 'Информация об отборе образца топлива:'
      }
      if (applicationForm?.productType === ProductType.Oil) {
        return 'Информация об отборе образца масла:'
      }
      return 'Информация об отборе образца:'
    }

    const applicationForm = await report.applicationForm
    const productType = this.reportService.getProductTypeLabel(
      applicationForm?.productType
    )
    const number = await this.reportService.getApplicationFormNumber(report)

    const html = `
      <style>
        html, body {
          font-size: 12px;
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
          № образца
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
                  ${applicationForm?.customerOrganization || ''}
                </div>
              </div>
            </td>
            <td>
            <div class="field">
              <div class="field__label">
                Контактный телефон
              </div>
              <div class="field__input">
                ${applicationForm?.customerPhone || ''}
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
                ${applicationForm?.customerPerson || ''}
              </div>
            </div>
            </td>
            <td>
            <div class="field">
              <div class="field__label">
                Электронная почта
              </div>
              <div class="field__input">
                ${applicationForm?.customerEmail || ''}
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
            <td>
              <div class="field">
                <div class="field__label">
                Производитель оборудования
                </div>
                <div class="field__input">
                  ${applicationForm?.vehicleEquipmentManufacturer || ''}
                </div>
              </div>
            </td>
            <td>
            <div class="field">
              <div class="field__label">
              Регистрационный номер
              </div>
              <div class="field__input">
                ${applicationForm?.vehicleRegistrationNumber || ''}
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
                ${applicationForm?.vehicleEquipmentModel || ''}
              </div>
            </div>
            </td>
            <td>
            <div class="field">
              <div class="field__label">
              Точка отбора образца
              </div>
              <div class="field__input">
                ${applicationForm?.vehicleSamplingPoint || ''}
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
                  ${applicationForm?.vehicleTotalOperatingTime || ''}
                </div>
              </div>
            </td>
            <td>
            <div class="field">
              <div class="field__label">
              Объём жидкости в оборудовании
              </div>
              <div class="field__input">
                ${applicationForm?.vehicleLiquidVolume || ''}
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
                ${applicationForm?.vehicleTotalOperatingTimeLubricant || ''}
              </div>
            </div>
            </td>
            <td>
            <div class="field">
              <div class="field__label">
              Долив СМ
              </div>
              <div class="field__input">
                ${applicationForm?.vehicleToppingUpLubricant || ''}
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
                  ${applicationForm?.lubricantBrand || ''}
                </div>
              </div>
            </td>
            <td>
            <div class="field">
              <div class="field__label">
              Вязкость
              </div>
              <div class="field__input">
                ${applicationForm?.lubricantViscosity || ''}
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
                ${applicationForm?.lubricantModel || ''}
              </div>
            </div>
            </td>
            <td>
            <div class="field">
              <div class="field__label">
              Состояние СМ
              </div>
              <div class="field__input">
                ${applicationForm?.lubricantState || ''}
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
                ${applicationForm?.selectionVolume || ''}
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
                ${applicationForm?.selectionBrand || ''}
              </div>
            </div>
            </td>
            <td>
            <div class="field">
              <div class="field__label">
              Место отбора пробы
              </div>
              <div class="field__input">
                ${applicationForm?.selectionPlace || ''}
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
          ${applicationForm?.note || ''}
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
    const sampledAt = report?.sampledAt.toLocaleDateString('ru-RU')
    const number = await this.reportService.getApplicationFormNumber(report)

    const style = `
    <style>
    html, body {
      font-size: 12px;
      padding: 0;
      font-family: 'DejaVu Serif', serif;

    }
    * {
      font-family: 'DejaVu Serif', serif;

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

        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        justify-content: space-between;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
      }
      .field + .field {
        margin-top: .75rem;
      }
      .field::after {
        content: '';
        display: table;
        clear: both;
      }
      .field__label {
        font-size: 1rem;
        line-height: 1.5rem;
        padding-right: 0.75rem;
        float: left;
        background: #ffffff;
      }
      .field__pre-label {
        font-size: 1rem;
        line-height: 1.5rem;
        background: #ffffff;
      }
      .field__input {
        font-size: 1rem;
        line-height: 1.5rem;
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
    </style>
    `

    const sticker = `
    <div class="sticker">
      <div class="field">
        <div class="field__label">
          № образца
        </div>
        <div class="field__input">
          ${number}
        </div>
      </div>
      <div class="field">
        <div class="field__label">
          Клиент
        </div>
        <div class="field__input">
          ${client?.name}
        </div>
      </div>
      <div class="field">
        <div class="field__pre-label">
          Дата оформления образца в личном
        </div>
        <div class="field__label">
          кабинете
        </div>
        <div class="field__input">
          ${sampledAt}
        </div>
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
      disableSmartShrinking: true
    }).pipe(response)
  }
}
