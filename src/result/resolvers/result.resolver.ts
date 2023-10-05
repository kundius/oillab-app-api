import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { NotFoundError } from '@app/graphql/errors/NotFoundError'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { CurrentUser } from '@app/auth/CurrentUser'
import { User, UserRole } from '@app/user/entities/user.entity'

import { ResultService } from '../services/result.service'
import { Result } from '../entities/result.entity'
import * as dto from '../dto/result.dto'
import { AuthenticationError } from '@app/graphql/errors/AuthenticationError'
import { NotAllowedError } from '@app/graphql/errors/NotAllowedError'

@Resolver(() => Result)
@UseGuards(GqlAuthGuard)
export class ResultResolver {
  constructor (
    private readonly resultService: ResultService
  ) {}

  @Query(() => Result, { nullable: true })
  async result (
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<Result | undefined> {
    if (!currentUser) {
      return undefined
    }

    return this.resultService.findById(id)
  }

  @Query(() => dto.ResultPaginateResponse)
  async resultPaginate (
    @Args() args: dto.ResultPaginateArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.ResultPaginateResponse> {
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

    return this.resultService.paginate(args)
  }

  @Mutation(() => dto.ResultCreateResponse)
  async resultCreate (
    @Args('input') input: dto.ResultCreateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.ResultCreateResponse> {
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

    const record = await this.resultService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.ResultUpdateResponse)
  async resultUpdate (
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: dto.ResultUpdateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.ResultUpdateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.resultService.findById(id)

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

    await this.resultService.update(record, input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => DefaultMutationResponse)
  async resultDelete (
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<DefaultMutationResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.resultService.findById(id)

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

    await this.resultService.delete(record)

    return {
      success: true
    }
  }
}
