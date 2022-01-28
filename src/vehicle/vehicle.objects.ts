import {
  InputType,
  Field,
  Int,
  ArgsType,
  ObjectType,
  registerEnumType,
  createUnionType
} from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { PaginatedResponse } from '@app/core/graphql/PaginatedResponse'
import { StringFilter } from '@app/core/graphql/StringFilter'
import { IdFilter } from '@app/core/graphql/IdFilter'

import { Vehicle } from './entities/vehicle.entity'
import * as types from './vehicle.types'
import * as errors from './vehicle.errors'

@InputType()
export class VehicleCreateInput implements types.VehicleCreateInput {
  @Field()
  model: string

  @Field()
  releaseYear: string

  @Field()
  stateNumber: string

  @Field()
  engineModel: string

  @Field()
  owner: number
}

export const VehicleCreateError = createUnionType({
  name: 'VehicleCreateError',
  types: () => [errors.VehicleCreateNotAllowedError]
})

@ObjectType()
export class VehicleCreateResponse {
  @Field()
  success: boolean

  @Field(() => Vehicle, { nullable: true })
  record?: Vehicle

  @Field(() => VehicleCreateError, { nullable: true })
  error?: typeof VehicleCreateError
}

@InputType()
export class VehicleUpdateInput implements types.VehicleUpdateInput {
  @Field({ nullable: true })
  model?: string

  @Field({ nullable: true })
  releaseYear?: string

  @Field({ nullable: true })
  stateNumber?: string

  @Field({ nullable: true })
  engineModel?: string

  @Field({ nullable: true })
  owner?: number
}

export const VehicleUpdateError = createUnionType({
  name: 'VehicleUpdateError',
  types: () => [errors.VehicleUpdateNotAllowedError, errors.VehicleNotFoundError]
})

@ObjectType()
export class VehicleUpdateResponse {
  @Field()
  success: boolean

  @Field(() => Vehicle, { nullable: true })
  record?: Vehicle

  @Field(() => VehicleUpdateError, { nullable: true })
  error?: typeof VehicleUpdateError
}

export const VehicleDeleteError = createUnionType({
  name: 'VehicleDeleteError',
  types: () => [errors.VehicleDeleteNotAllowedError, errors.VehicleNotFoundError]
})

@ObjectType()
export class VehicleDeleteResponse {
  @Field()
  success: boolean

  @Field(() => VehicleDeleteError, { nullable: true })
  error?: typeof VehicleDeleteError
}

registerEnumType(types.VehicleSort, {
  name: 'VehicleSort'
})

@InputType()
export class VehicleFilter implements types.VehicleFilter {
  @Field({ nullable: true })
  model?: StringFilter

  @Field({ nullable: true })
  releaseYear?: StringFilter

  @Field({ nullable: true })
  stateNumber?: StringFilter

  @Field({ nullable: true })
  engineModel?: StringFilter

  @Field({ nullable: true })
  ownerName?: StringFilter

  @Field({ nullable: true })
  ownerId?: IdFilter
}

@ArgsType()
export class VehiclePaginateArgs implements types.VehiclePaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [types.VehicleSort], { nullable: true })
  sort?: types.VehicleSort[]

  @Field(() => VehicleFilter, { nullable: true })
  @Type(() => VehicleFilter)
  filter?: VehicleFilter
}

@ObjectType()
export class VehiclePaginateResponse
  extends PaginatedResponse
  implements types.VehiclePaginatedResult
{
  @Field(() => [Vehicle])
  items: Vehicle[]
}
