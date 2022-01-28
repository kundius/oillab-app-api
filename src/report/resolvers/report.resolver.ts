import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'

import { ReportService } from '../services/report.service'
import { Report } from '../entities/report.entity'
import * as objects from '../report.objects'

@Resolver(() => Report)
@UseGuards(GqlAuthGuard)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @Query(() => Report, { nullable: true })
  async report(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Report | undefined> {
    return this.reportService.findById(id)
  }

  @Query(() => objects.ReportPaginateResponse)
  async reportPaginate(
    @Args() args: objects.ReportPaginateArgs
  ): Promise<objects.ReportPaginateResponse> {
    return this.reportService.paginate(args)
  }

  @Mutation(() => objects.ReportGeneratePdfResponse)
  async reportGeneratePdf(
    @Args() args: objects.ReportGeneratePdfArgs
  ): Promise<objects.ReportGeneratePdfResponse> {
    const result = await this.reportService.generatePdf(args.filter, args.sort)

    return result.match<objects.ReportGeneratePdfResponse>(
      (record) => ({
        record,
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }

  @Mutation(() => objects.ReportCreateResponse)
  async reportCreate(
    @Args('input') input: objects.ReportCreateInput
  ): Promise<objects.ReportCreateResponse> {
    const result = await this.reportService.create(input)

    return result.match<objects.ReportCreateResponse>(
      (record) => ({
        record,
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }

  @Mutation(() => objects.ReportUpdateResponse)
  async reportUpdate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: objects.ReportUpdateInput
  ): Promise<objects.ReportUpdateResponse> {
    const result = await this.reportService.update(id, input)

    return result.match<objects.ReportUpdateResponse>(
      (record) => ({
        record,
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }

  @Mutation(() => objects.ReportDeleteResponse)
  async reportDelete(
    @Args('id', { type: () => Int }) id: number
  ): Promise<objects.ReportDeleteResponse> {
    const result = await this.reportService.delete(id)

    return result.match<objects.ReportDeleteResponse>(
      () => ({
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }
}
