import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { NotFoundError } from '@app/graphql/NotFoundError'
import { ContextService } from '@app/context/context.service'

import { ReportService } from '../services/report.service'
import { Report } from '../entities/report.entity'
import * as dto from '../dto/report.dto'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { UserRole } from '@app/user/entities/user.entity'
import { PermissionDeniedError } from '@app/graphql/PermissionDeniedError'

@Resolver(() => Report)
@UseGuards(GqlAuthGuard)
export class ReportResolver {
  constructor(
    private readonly reportService: ReportService,
    private readonly contextService: ContextService
  ) {}

  @Query(() => Report, { nullable: true })
  async report(
    @Args('id', { type: () => String }) id: string
  ): Promise<Report | undefined> {
    return this.reportService.findById(id)
  }

  @Query(() => dto.ReportPaginateResponse)
  async reportPaginate(
    @Args() args: dto.ReportPaginateArgs
  ): Promise<dto.ReportPaginateResponse> {
    return this.reportService.paginate(args, (qb) => {
      const currentUser = this.contextService.getCurrentUser()
      if (currentUser.role !== UserRole.Administrator) {
        qb.andWhere('report.client = :onlySelfId', {
          onlySelfId: currentUser.id
        })
      }
    })
  }

  @Mutation(() => dto.ReportGeneratePdfResponse)
  async reportGeneratePdf(
    @Args() args: dto.ReportGeneratePdfArgs
  ): Promise<dto.ReportGeneratePdfResponse> {
    const currentUser = this.contextService.getCurrentUser()

    if (!currentUser) {
      return {
        error: new PermissionDeniedError('Forbidden'),
        success: false
      }
    }

    const file = await this.reportService.generatePdf(
      args.filter,
      args.sort,
      (qb) => {
        if (currentUser.role !== UserRole.Administrator) {
          qb.andWhere('report.client = :onlySelfId', {
            onlySelfId: currentUser.id
          })
        }
      }
    )

    return {
      record: file,
      success: true
    }
  }

  @Mutation(() => dto.ReportCreateResponse)
  async reportCreate(
    @Args('input') input: dto.ReportCreateInput
  ): Promise<dto.ReportCreateResponse> {
    const currentUser = this.contextService.getCurrentUser()

    if (
      typeof input.client !== 'undefined' &&
      currentUser.role !== UserRole.Administrator &&
      input.client !== currentUser.id
    ) {
      return {
        error: new PermissionDeniedError('Вам не разрешено изменять клиента'),
        success: false
      }
    }

    if (currentUser.role === UserRole.Member) {
      input.client = currentUser.id
    }

    const record = await this.reportService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.ReportUpdateResponse)
  async reportUpdate(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: dto.ReportUpdateInput
  ): Promise<dto.ReportUpdateResponse> {
    const currentUser = this.contextService.getCurrentUser()
    const record = await this.reportService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    if (
      typeof input.client !== 'undefined' &&
      currentUser.role !== UserRole.Administrator &&
      input.client !== (await record.client).id &&
      input.client !== currentUser.id
    ) {
      return {
        error: new PermissionDeniedError('Вам не разрешено изменять клиента'),
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
  async reportDelete(@Args('id') id: string): Promise<DefaultMutationResponse> {
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
