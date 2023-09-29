import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { NotFoundError } from '@app/graphql/errors/NotFoundError'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { CurrentUser } from '@app/auth/CurrentUser'
import { User, UserRole } from '@app/user/entities/user.entity'

import { OilTypeService } from '../services/oil-type.service'
import { OilType } from '../entities/oil-type.entity'
import * as dto from '../dto/oil-type.dto'
import { AuthenticationError } from '@app/graphql/errors/AuthenticationError'
import { NotAllowedError } from '@app/graphql/errors/NotAllowedError'

@Resolver(() => OilType)
@UseGuards(GqlAuthGuard)
export class OilTypeResolver {
  constructor (
    private readonly oiltypeService: OilTypeService
  ) {}

  @Query(() => OilType, { nullable: true })
  async oiltype (
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<OilType | undefined> {
    if (!currentUser) {
      return undefined
    }

    return this.oiltypeService.findById(id)
  }

  @Query(() => dto.OilTypePaginateResponse)
  async oiltypePaginate (
    @Args() args: dto.OilTypePaginateArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.OilTypePaginateResponse> {
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

    return this.oiltypeService.paginate(args)
  }

  @Mutation(() => dto.OilTypeCreateResponse)
  async oiltypeCreate (
    @Args('input') input: dto.OilTypeCreateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.OilTypeCreateResponse> {
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

    const record = await this.oiltypeService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.OilTypeUpdateResponse)
  async oiltypeUpdate (
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: dto.OilTypeUpdateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.OilTypeUpdateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.oiltypeService.findById(id)

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

    await this.oiltypeService.update(record, input)

    return {
      record,
      success: true
    }
  }


  @Mutation(() => DefaultMutationResponse)
  async oiltypeDelete (
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<DefaultMutationResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.oiltypeService.findById(id)

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

    await this.oiltypeService.delete(record)

    return {
      success: true
    }
  }
}
