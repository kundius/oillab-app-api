import { CurrentUser } from '@app/auth/CurrentUser'
import { GqlAuthGuard } from '@app/auth/auth.guard'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { AuthenticationError } from '@app/graphql/errors/AuthenticationError'
import { NotAllowedError } from '@app/graphql/errors/NotAllowedError'
import { NotFoundError } from '@app/graphql/errors/NotFoundError'
import { User, UserRole } from '@app/user/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import * as dto from '../dto/oil-type-indicator.dto'
import { OilTypeIndicator } from '../entities/oil-type-indicator.entity'
import { OilType } from '../entities/oil-type.entity'
import { OilTypeIndicatorService } from '../services/oil-type-indicator.service'
import { OilTypeService } from '../services/oil-type.service'

@Resolver(() => OilTypeIndicator)
@UseGuards(GqlAuthGuard)
export class OilTypeIndicatorResolver {
  constructor(
    private readonly oilTypeService: OilTypeService,
    private readonly oilTypeIndicatorService: OilTypeIndicatorService
  ) {}

  @Query(() => OilType, { nullable: true })
  async oilTypeIndicator(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<OilTypeIndicator | null> {
    if (!currentUser) {
      return null
    }

    return this.oilTypeIndicatorService.findById(id)
  }

  @Query(() => dto.OilTypeIndicatorListResponse)
  async oilTypeIndicatorList(
    @Args() args: dto.OilTypeIndicatorListArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.OilTypeIndicatorListResponse> {
    if (!currentUser) {
      return {
        items: []
      }
    }

    return this.oilTypeIndicatorService.list(args)
  }

  @Mutation(() => dto.OilTypeIndicatorCreateResponse)
  async oilTypeIndicatorCreate(
    @Args('oilTypeId', { type: () => Int }) oilTypeId: number,
    @Args('input') input: dto.OilTypeIndicatorCreateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.OilTypeIndicatorCreateResponse> {
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

    const oilType = await this.oilTypeService.findById(oilTypeId)

    if (!oilType) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    const record = await this.oilTypeIndicatorService.create(oilType, input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.OilTypeIndicatorUpdateResponse)
  async oilTypeIndicatorUpdate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: dto.OilTypeIndicatorUpdateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.OilTypeIndicatorUpdateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.oilTypeIndicatorService.findById(id)

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

    await this.oilTypeIndicatorService.update(record, input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => DefaultMutationResponse)
  async oilTypeIndicatorDelete(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<DefaultMutationResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.oilTypeIndicatorService.findById(id)

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

    await this.oilTypeIndicatorService.delete(record)

    return {
      success: true
    }
  }
}
