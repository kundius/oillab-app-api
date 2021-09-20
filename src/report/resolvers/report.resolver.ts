import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { NotFoundError } from '@app/graphql/NotFoundError'

import { ReportService } from '../services/report.service'
import { Report } from '../entities/report.entity'
import * as dto from '../dto/report.dto'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'

@Resolver(() => Report)
@UseGuards(GqlAuthGuard)
export class ReportResolver {
  constructor (
    private readonly reportService: ReportService
  ) {}

  @Query(() => Report, { nullable: true })
  async report (
    @Args('id', { type: () => String }) id: string
  ): Promise<Report | undefined> {
    return this.reportService.findById(id)
  }

  @Query(() => dto.ReportPaginateResponse)
  async reportPaginate (
    @Args() args: dto.ReportPaginateArgs
  ): Promise<dto.ReportPaginateResponse> {
    return this.reportService.paginate(args)
  }

  @Mutation(() => dto.ReportCreateResponse)
  async reportCreate (
    @Args('input') input: dto.ReportCreateInput
  ): Promise<dto.ReportCreateResponse> {
    const record = await this.reportService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.ReportUpdateResponse)
  async reportUpdate (
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: dto.ReportUpdateInput
  ): Promise<dto.ReportUpdateResponse> {
    const record = await this.reportService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    await this.reportService.update(record, input)

    return {
      record,
      success: true
    }
  }

  
  @Mutation(() => DefaultMutationResponse)
  async reportDelete (
    @Args('id') id: string
  ): Promise<DefaultMutationResponse> {
    const record = await this.reportService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    await this.reportService.delete(record)

    return {
      success: true
    }
  }
}
