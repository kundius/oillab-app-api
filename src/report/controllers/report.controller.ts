import {
  Controller,
  Get,
  Header,
  StreamableFile,
  UseGuards,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
  Param
} from '@nestjs/common'
import { createReadStream } from 'fs'
import { join } from 'path'
import { AuthGuard } from '@nestjs/passport'
import * as HtmlPdf from 'html-pdf'
import { CurrentUser } from '@app/auth/CurrentUser'
import { User, UserRole } from '@app/user/entities/user.entity'
import { ReportService } from '../services/report.service'

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/applicationForm')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=applicationForm.pdf')
  async applicationForm(
    @Param('id') id: string,
    @CurrentUser() currentUser?: User
  ): Promise<StreamableFile> {
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

    const html = `
      <style>
        table {
          font-size: 6px;
          width: 100%;
          border: 1px solid #e1e6eb;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          background: #f3f4f7;
          padding: 5px;
          border: 1px solid #e1e6eb;
        }
        td {
          padding: 5px;
          border: 1px solid #e1e6eb;
        }
      </style>
      ${report.id}
    `
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      HtmlPdf.create(html).toBuffer((err, buffer) => resolve(buffer))
    })

    return new StreamableFile(pdfBuffer)
  }
}
