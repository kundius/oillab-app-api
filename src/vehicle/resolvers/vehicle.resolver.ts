import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { NotFoundError } from '@app/graphql/NotFoundError'

import { VehicleService } from '../services/vehicle.service'
import { Vehicle } from '../entities/vehicle.entity'
import * as dto from '../dto/vehicle.dto'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'

@Resolver(() => Vehicle)
@UseGuards(GqlAuthGuard)
export class VehicleResolver {
  constructor (
    private readonly vehicleService: VehicleService
  ) {}

  @Query(() => Vehicle, { nullable: true })
  async vehicle (
    @Args('id', { type: () => String }) id: string
  ): Promise<Vehicle | undefined> {
    return this.vehicleService.findById(id)
  }

  @Query(() => dto.VehiclePaginateResponse)
  async vehiclePaginate (
    @Args() args: dto.VehiclePaginateArgs
  ): Promise<dto.VehiclePaginateResponse> {
    return this.vehicleService.paginate(args)
  }

  @Mutation(() => dto.VehicleCreateResponse)
  async vehicleCreate (
    @Args('input') input: dto.VehicleCreateInput
  ): Promise<dto.VehicleCreateResponse> {
    const record = await this.vehicleService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.VehicleUpdateResponse)
  async vehicleUpdate (
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: dto.VehicleUpdateInput
  ): Promise<dto.VehicleUpdateResponse> {
    const record = await this.vehicleService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
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
    @Args('id') id: string
  ): Promise<DefaultMutationResponse> {
    const record = await this.vehicleService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    await this.vehicleService.delete(record)

    return {
      success: true
    }
  }
}
