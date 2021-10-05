import { Controller, Get, Res, Query, HttpException, HttpStatus } from '@nestjs/common'

import { ReportService } from '@app/report/services/report.service'
import { ContextService } from '@app/context/context.service'
import { UserRole } from '@app/user/entities/user.entity'

import * as dto from '../dto/report.dto'

@Controller('report')
export class ReportController {
  constructor(
    private readonly contextService: ContextService,
    private readonly reportService: ReportService
  ) {}

  @Get('/pdf')
  async getPDF(
    @Res() res,
    @Query()
    query: {
      filter?: dto.ReportFilter
      sort?: string
    }
  ): Promise<void> {
    // const currentUser = this.contextService.getCurrentUser()

    // if (!currentUser) {
    //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    // }

    const buffer = await this.reportService.generatePDF(
      query.filter,
      [dto.ReportSort[query.sort]],
      // (qb) => {
      //   if (currentUser.role !== UserRole.Administrator) {
      //     qb.andWhere('report.client = :onlySelfId', {
      //       onlySelfId: currentUser.id
      //     })
      //   }
      // }
    )

    res.set({
      'Content-Type': 'application/pdf',
      // 'Content-Disposition': 'attachment; filename=reports.pdf',
      'Content-Length': buffer.length
    })

    res.end(buffer)
  }
}
