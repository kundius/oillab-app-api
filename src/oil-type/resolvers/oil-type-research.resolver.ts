import { CurrentUser } from '@app/auth/CurrentUser'
import { GqlAuthGuard } from '@app/auth/auth.guard'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { AuthenticationError } from '@app/graphql/errors/AuthenticationError'
import { NotAllowedError } from '@app/graphql/errors/NotAllowedError'
import { NotFoundError } from '@app/graphql/errors/NotFoundError'
import { User, UserRole } from '@app/user/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import * as dto from '../dto/oil-type-research.dto'
import { OilTypeResearch } from '../entities/oil-type-research.entity'
import { OilType } from '../entities/oil-type.entity'
import { OilTypeResearchService } from '../services/oil-type-research.service'
import { OilTypeService } from '../services/oil-type.service'

@Resolver(() => OilTypeResearch)
@UseGuards(GqlAuthGuard)
export class OilTypeResearchResolver {
  constructor(
    private readonly oilTypeService: OilTypeService,
    private readonly oilTypeResearchService: OilTypeResearchService
  ) {}

  @Query(() => OilType, { nullable: true })
  async oilTypeResearch(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<OilTypeResearch | null> {
    if (!currentUser) {
      return null
    }

    return this.oilTypeResearchService.findById(id)
  }

  @Query(() => dto.OilTypeResearchListResponse)
  async oilTypeResearchList(
    @Args() args: dto.OilTypeResearchListArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.OilTypeResearchListResponse> {
    if (!currentUser) {
      return {
        items: []
      }
    }

    return this.oilTypeResearchService.list(args)
  }

  @Mutation(() => dto.OilTypeResearchCreateResponse)
  async oilTypeResearchCreate(
    @Args('oilTypeId', { type: () => Int }) oilTypeId: number,
    @Args('input') input: dto.OilTypeResearchCreateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.OilTypeResearchCreateResponse> {
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

    const record = await this.oilTypeResearchService.create(oilType, input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.OilTypeResearchUpdateResponse)
  async oilTypeResearchUpdate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: dto.OilTypeResearchUpdateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.OilTypeResearchUpdateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.oilTypeResearchService.findById(id)

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

    await this.oilTypeResearchService.update(record, input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => DefaultMutationResponse)
  async oilTypeResearchDelete(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<DefaultMutationResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.oilTypeResearchService.findById(id)

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

    await this.oilTypeResearchService.delete(record)

    return {
      success: true
    }
  }
}
