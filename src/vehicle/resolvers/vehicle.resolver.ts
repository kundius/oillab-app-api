import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { NotFoundError } from '@app/graphql/errors/NotFoundError'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { CurrentUser } from '@app/auth/CurrentUser'
import { User, UserRole } from '@app/user/entities/user.entity'

import { VehicleService } from '../services/vehicle.service'
import { Vehicle } from '../entities/vehicle.entity'
import * as dto from '../dto/vehicle.dto'
import { AuthenticationError } from '@app/graphql/errors/AuthenticationError'
import { NotAllowedError } from '@app/graphql/errors/NotAllowedError'

@Resolver(() => Vehicle)
@UseGuards(GqlAuthGuard)
export class VehicleResolver {
  constructor (
    private readonly vehicleService: VehicleService
  ) {}

  @Query(() => Vehicle, { nullable: true })
  async vehicle (
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<Vehicle | undefined> {
    if (!currentUser) {
      return undefined
    }

    return this.vehicleService.findById(id)
  }

  @Query(() => dto.VehiclePaginateResponse)
  async vehiclePaginate (
    @Args() args: dto.VehiclePaginateArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.VehiclePaginateResponse> {
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

    return this.vehicleService.paginate(args)
  }

  @Mutation(() => dto.VehicleCreateResponse)
  async vehicleCreate (
    @Args('input') input: dto.VehicleCreateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.VehicleCreateResponse> {
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

    const record = await this.vehicleService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.VehicleUpdateResponse)
  async vehicleUpdate (
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: dto.VehicleUpdateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.VehicleUpdateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.vehicleService.findById(id)

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

    await this.vehicleService.update(record, input)

    return {
      record,
      success: true
    }
  }


  @Mutation(() => DefaultMutationResponse)
  async vehicleDelete (
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<DefaultMutationResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.vehicleService.findById(id)

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

    await this.vehicleService.delete(record)

    return {
      success: true
    }
  }
}
