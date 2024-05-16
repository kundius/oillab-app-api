import { CurrentUser } from '@app/auth/CurrentUser'
import { GqlAuthGuard } from '@app/auth/auth.guard'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { AuthenticationError } from '@app/graphql/errors/AuthenticationError'
import { NotAllowedError } from '@app/graphql/errors/NotAllowedError'
import { NotFoundError } from '@app/graphql/errors/NotFoundError'
import { User, UserRole } from '@app/user/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import * as dto from '../dto/lubricant.dto'
import { Lubricant } from '../entities/lubricant.entity'
import { LubricantService } from '../services/lubricant.service'

@Resolver(() => Lubricant)
@UseGuards(GqlAuthGuard)
export class LubricantResolver {
  constructor(private readonly lubricantService: LubricantService) {}

  @Query(() => Lubricant, { nullable: true })
  async lubricant(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<Lubricant | null> {
    if (!currentUser) {
      return null
    }

    return this.lubricantService.findById(id)
  }

  @Query(() => dto.LubricantPaginateResponse)
  async lubricantPaginate(
    @Args() args: dto.LubricantPaginateArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.LubricantPaginateResponse> {
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

    return this.lubricantService.paginate(args)
  }

  @Mutation(() => dto.LubricantCreateResponse)
  async lubricantCreate(
    @Args('input') input: dto.LubricantCreateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.LubricantCreateResponse> {
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

    const record = await this.lubricantService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.LubricantUpdateResponse)
  async lubricantUpdate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: dto.LubricantUpdateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.LubricantUpdateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.lubricantService.findById(id)

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

    await this.lubricantService.update(record, input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => DefaultMutationResponse)
  async lubricantDelete(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<DefaultMutationResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.lubricantService.findById(id)

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

    await this.lubricantService.delete(record)

    return {
      success: true
    }
  }
}
