import { InputType, Field, Int, ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { Vehicle } from '@app/vehicle/entities/vehicle.entity'
import { StringFilter } from '@app/graphql/StringFilter'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'

@InputType()
export class VehicleCreateInput {
  @Field()
  model: string

  @Field()
  releaseYear: string

  @Field()
  stateNumber: string

  @Field()
  engineModel: string

  @Field()
  generalOperatingTime: string

  @Field()
  owner: string
}

@ObjectType()
export class VehicleCreateResponse extends DefaultMutationResponse {
  @Field(() => Vehicle, { nullable: true })
  record?: Vehicle
}

@InputType()
export class VehicleUpdateInput {
  @Field({ nullable: true })
  model?: string

  @Field({ nullable: true })
  releaseYear?: string

  @Field({ nullable: true })
  stateNumber?: string

  @Field({ nullable: true })
  engineModel?: string

  @Field({ nullable: true })
  generalOperatingTime?: string

  @Field({ nullable: true })
  owner?: string
}

@ObjectType()
export class VehicleUpdateResponse extends DefaultMutationResponse {
  @Field(() => Vehicle, { nullable: true })
  record?: Vehicle
}

export enum VehicleSort {
  MODEL_ASC,
  MODEL_DESC,
  RELEASE_YEAR_ASC,
  RELEASE_YEAR_DESC,
  STATE_NUMBER_ASC,
  STATE_NUMBER_DESC,
  ENGINE_MODEL_ASC,
  ENGINE_MODEL_DESC,
  GENERAL_OPERATING_TIME_ASC,
  GENERAL_OPERATING_TIME_DESC
}

registerEnumType(VehicleSort, {
  name: 'VehicleSort'
})

@InputType()
export class VehicleFilter {
  @Field({ nullable: true })
  model?: StringFilter

  @Field({ nullable: true })
  releaseYear?: StringFilter

  @Field({ nullable: true })
  stateNumber?: StringFilter

  @Field({ nullable: true })
  engineModel?: StringFilter

  @Field({ nullable: true })
  generalOperatingTime?: StringFilter
}

@ArgsType()
export class VehiclePaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [VehicleSort], { nullable: true })
  sort?: VehicleSort[]

  @Field(() => VehicleFilter, { nullable: true })
  @Type(() => VehicleFilter)
  filter?: VehicleFilter
}

@ObjectType()
export class VehiclePaginateResponse extends PaginatedResponse {
  @Field(() => [Vehicle])
  items: Vehicle[]
}
