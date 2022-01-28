import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'

import { VehicleService } from '../services/vehicle.service'
import { Vehicle } from '../entities/vehicle.entity'
import * as objects from '../vehicle.objects'

@Resolver(() => Vehicle)
@UseGuards(GqlAuthGuard)
export class VehicleResolver {
  constructor(private readonly vehicleService: VehicleService) {}

  @Query(() => Vehicle, { nullable: true })
  async vehicle(
    @Args('id', { type: () => Int }) id: number
  ): Promise<Vehicle | undefined> {
    return this.vehicleService.findById(id)
  }

  @Query(() => objects.VehiclePaginateResponse)
  async vehiclePaginate(
    @Args() args: objects.VehiclePaginateArgs
  ): Promise<objects.VehiclePaginateResponse> {
    return this.vehicleService.paginate(args)
  }

  @Mutation(() => objects.VehicleCreateResponse)
  async vehicleCreate(
    @Args('input') input: objects.VehicleCreateInput
  ): Promise<objects.VehicleCreateResponse> {
    const result = await this.vehicleService.create(input)

    return result.match<objects.VehicleCreateResponse>(
      (record) => ({
        record,
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }

  @Mutation(() => objects.VehicleUpdateResponse)
  async vehicleUpdate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: objects.VehicleUpdateInput
  ): Promise<objects.VehicleUpdateResponse> {
    const result = await this.vehicleService.update(id, input)

    return result.match<objects.VehicleUpdateResponse>(
      (record) => ({
        record,
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }

  @Mutation(() => objects.VehicleDeleteResponse)
  async vehicleDelete(
    @Args('id', { type: () => Int }) id: number
  ): Promise<objects.VehicleDeleteResponse> {
    const result = await this.vehicleService.delete(id)

    return result.match<objects.VehicleDeleteResponse>(
      () => ({
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }
}
