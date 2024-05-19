import { CurrentUser } from '@app/auth/CurrentUser'
import { GqlAuthGuard } from '@app/auth/auth.guard'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { AuthenticationError } from '@app/graphql/errors/AuthenticationError'
import { NotAllowedError } from '@app/graphql/errors/NotAllowedError'
import { NotFoundError } from '@app/graphql/errors/NotFoundError'
import { User, UserRole } from '@app/user/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import * as dto from '../dto/brand.dto'
import { Brand } from '../entities/brand.entity'
import { BrandService } from '../services/brand.service'

@Resolver(() => Brand)
@UseGuards(GqlAuthGuard)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}

  @Query(() => Brand, { nullable: true })
  async brand(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<Brand | null> {
    if (!currentUser) {
      return null
    }

    return this.brandService.findById(id)
  }

  @Query(() => dto.BrandPaginateResponse)
  async brandPaginate(
    @Args() args: dto.BrandPaginateArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.BrandPaginateResponse> {
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

    return this.brandService.paginate(args)
  }

  @Mutation(() => dto.BrandCreateResponse)
  async brandCreate(
    @Args('input') input: dto.BrandCreateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.BrandCreateResponse> {
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

    const record = await this.brandService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.BrandUpdateResponse)
  async brandUpdate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: dto.BrandUpdateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.BrandUpdateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.brandService.findById(id)

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

    await this.brandService.update(record, input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => DefaultMutationResponse)
  async brandDelete(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<DefaultMutationResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.brandService.findById(id)

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

    await this.brandService.delete(record)

    return {
      success: true
    }
  }
}
