import { InputType, Field, Int, ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Type } from 'class-transformer';

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { UserFilter } from '@app/user/dto/user.dto'
import { Vehicle } from '@app/vehicle/entities/vehicle.entity'
import { StringFilterOperator } from '@app/graphql/filters/StringFilterOperator'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { IdFilterOperator } from '@app/graphql/filters/IdFilterOperator'
import { BaseFilter } from '@app/graphql/filters/BaseFilter';

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

  @Field({ nullable: true })
  liquidVolume?: string

  @Field()
  owner: number
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
  liquidVolume?: string

  @Field({ nullable: true })
  owner?: number
}

@ObjectType()
export class VehicleUpdateResponse extends DefaultMutationResponse {
  @Field(() => Vehicle, { nullable: true })
  record?: Vehicle
}

export enum VehicleSort {
  MODEL_ASC = "model_ASC",
  MODEL_DESC = "model_DESC",
  RELEASE_YEAR_ASC = "releaseYear_ASC",
  RELEASE_YEAR_DESC = "releaseYear_DESC",
  STATE_NUMBER_ASC = "stateNumber_ASC",
  STATE_NUMBER_DESC = "stateNumber_DESC",
  ENGINE_MODEL_ASC = "engineModel_ASC",
  ENGINE_MODEL_DESC = "engineModel_DESC",
  LIQUID_VOLUME_ASC = "liquidVolume_ASC",
  LIQUID_VOLUME_DESC = "liquidVolume_DESC",
  GENERAL_OPERATING_TIME_ASC = "generalOperatingTime_ASC",
  GENERAL_OPERATING_TIME_DESC = "generalOperatingTime_DESC"
}

registerEnumType(VehicleSort, {
  name: 'VehicleSort'
})

@InputType()
export class VehicleFilter extends BaseFilter {
  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  model?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  releaseYear?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  stateNumber?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  engineModel?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  liquidVolume?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  ownerName?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => UserFilter)
  owner?: UserFilter

  @Field({ nullable: true })
  @Type(() => IdFilterOperator)
  ownerId?: IdFilterOperator
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
