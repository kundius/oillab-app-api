import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { NotFoundError } from '@app/graphql/errors/NotFoundError'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { User, UserRole } from '@app/user/entities/user.entity'
import { NotAllowedError } from '@app/graphql/errors/NotAllowedError'
import { CurrentUser } from '@app/auth/CurrentUser'
import { AuthenticationError } from '@app/graphql/errors/AuthenticationError'
import { ValidationError } from '@app/graphql/errors/ValidationError'

import { ReportService } from '../services/report.service'
import { Report } from '../entities/report.entity'
import * as dto from '../dto/report.dto'

@Resolver(() => Report)
@UseGuards(GqlAuthGuard)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @Query(() => Report, { nullable: true })
  async report(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<Report | null> {
    if (!currentUser) {
      return null
    }

    return this.reportService.findById(id)
  }

  @Query(() => Report, { nullable: true })
  async reportByFormNumber(
    @Args('formNumber', { type: () => String }) formNumber: string,
    @CurrentUser() currentUser?: User
  ): Promise<Report | null> {
    if (!currentUser) {
      return null
    }

    return this.reportService.findByFormNumber(formNumber)
  }

  @Query(() => dto.ReportPaginateResponse)
  async reportPaginate(
    @Args() args: dto.ReportPaginateArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.ReportPaginateResponse> {
    if (!currentUser) {
      return {
        items: [],
        pageInfo: {
          total: 0,
          page: args.page,
          perPage: args.perPage
        }
      }
    }

    if ([UserRole.Administrator, UserRole.Manager].includes(currentUser.role)) {
      return this.reportService.paginate(args)
    } else {
      return this.reportService.paginate(args, currentUser)
    }
  }

  @Mutation(() => dto.ReportSendResponse)
  async reportSend(
    @Args('input') input: dto.ReportSendInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.ReportSendResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    if (currentUser.role !== UserRole.Administrator) {
      return {
        error: new NotAllowedError(),
        success: false
      }
    }

    await this.reportService.send(input)

    return {
      success: true
    }
  }
  @Mutation(() => dto.ReportGeneratePdfResponse)
  async reportGeneratePdf(
    @Args() args: dto.ReportGeneratePdfArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.ReportGeneratePdfResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const file = await this.reportService.generatePdf(
      args.filter,
      args.sort,
      [UserRole.Administrator, UserRole.Manager].includes(currentUser.role)
        ? undefined
        : currentUser
    )

    return {
      record: file,
      success: true
    }
  }

  @Mutation(() => dto.ReportCreateResponse)
  async reportCreate(
    @Args('input') input: dto.ReportCreateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.ReportCreateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    if (currentUser.role !== UserRole.Administrator) {
      return {
        error: new NotAllowedError(),
        success: false
      }
    }

    if (typeof input.formNumber !== 'undefined' && !input.formNumber) {
      return {
        error: new ValidationError(
          'formNumber',
          'Номер бланка не может быть пустым.'
        ),
        success: false
      }
    }

    if (input.formNumber.startsWith('0') || input.formNumber.includes(' ')) {
      return {
        error: new ValidationError(
          'formNumber',
          'Номер бланка не может начинаться с 0 или содержать пробелы.'
        ),
        success: false
      }
    }

    if (await this.reportService.isFormNumberExists(input.formNumber)) {
      return {
        error: new ValidationError(
          'formNumber',
          'Указанный номер бланка занят.'
        ),
        success: false
      }
    }

    const record = await this.reportService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.ReportUpdateResponse)
  async reportUpdate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: dto.ReportUpdateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.ReportUpdateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.reportService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    if (currentUser.role !== UserRole.Administrator) {
      return {
        error: new NotAllowedError(),
        success: false
      }
    }

    if (typeof input.formNumber !== 'undefined') {
      if (!input.formNumber) {
        return {
          error: new ValidationError(
            'formNumber',
            'Номер бланка не может быть пустым.'
          ),
          success: false
        }
      }

      if (input.formNumber.startsWith('0') || input.formNumber.includes(' ')) {
        return {
          error: new ValidationError(
            'formNumber',
            'Номер бланка не может начинаться с 0 или содержать пробелы.'
          ),
          success: false
        }
      }

      if (
        record.formNumber !== input.formNumber &&
        (await this.reportService.isFormNumberExists(input.formNumber))
      ) {
        return {
          error: new ValidationError(
            'formNumber',
            'Указанный номер бланка занят.'
          ),
          success: false
        }
      }
    }

    await this.reportService.update(record, input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => DefaultMutationResponse)
  async reportDelete(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<DefaultMutationResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.reportService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    if (currentUser.role !== UserRole.Administrator) {
      return {
        error: new NotAllowedError(),
        success: false
      }
    }

    await this.reportService.delete(record)

    return {
      success: true
    }
  }
}
