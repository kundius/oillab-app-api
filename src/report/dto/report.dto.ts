import { InputType, Field, Int, ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { Report, ReportColor } from '@app/report/entities/report.entity'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { StringFilterOperator } from '@app/graphql/filters/StringFilterOperator'
import { DateFilterOperator } from '@app/graphql/filters/DateFilterOperator'
import { NumberFilterOperator } from '@app/graphql/filters/NumberFilterOperator'
import { File } from '@app/file/file.entity'
import { BaseFilter } from '@app/graphql/filters/BaseFilter'
import { UserFilter } from '@app/user/dto/user.dto'
import { VehicleFilter } from '@app/vehicle/dto/vehicle.dto'
import { LubricantFilter } from '@app/lubricant/dto/lubricant.dto'

@InputType()
export class ReportCreateInput {
  @Field({ nullable: true })
  color?: ReportColor

  @Field()
  totalMileage: string

  @Field()
  lubricantMileage: string

  @Field()
  samplingNodes: string

  @Field()
  formNumber: string

  @Field({ nullable: true })
  vehicleToppingUpLubricant?: string

  @Field({ nullable: true })
  lubricantState?: string

  @Field({ nullable: true })
  selectionVolume?: string

  @Field({ nullable: true })
  note?: string

  @Field(() => Date)
  sampledAt: Date

  @Field(() => Int, { nullable: true })
  client?: number

  @Field(() => Int, { nullable: true })
  vehicle?: number

  @Field(() => Int, { nullable: true })
  oilTypeId?: number

  @Field(() => Int, { nullable: true })
  lubricantEntityId?: number

  @Field(() => Int, { nullable: true })
  expressLaboratoryResult?: number | null

  @Field(() => Int, { nullable: true })
  laboratoryResult?: number | null
}

@ObjectType()
export class ReportCreateResponse extends DefaultMutationResponse {
  @Field(() => Report, { nullable: true })
  record?: Report
}

@InputType()
export class ReportUpdateInput {
  @Field({ nullable: true })
  color?: ReportColor

  @Field({ nullable: true })
  totalMileage?: string

  @Field({ nullable: true })
  lubricantMileage?: string

  @Field({ nullable: true })
  samplingNodes?: string

  @Field({ nullable: true })
  formNumber?: string

  @Field({ nullable: true })
  vehicleToppingUpLubricant?: string

  @Field({ nullable: true })
  lubricantState?: string

  @Field({ nullable: true })
  selectionVolume?: string

  @Field({ nullable: true })
  note?: string

  @Field(() => Date, { nullable: true })
  sampledAt?: Date

  @Field(() => Int, { nullable: true })
  client?: number

  @Field(() => Int, { nullable: true })
  vehicle?: number

  @Field(() => Int, { nullable: true })
  oilTypeId?: number

  @Field(() => Int, { nullable: true })
  lubricantEntityId?: number

  @Field(() => Int, { nullable: true })
  expressLaboratoryResult?: number | null

  @Field(() => Int, { nullable: true })
  laboratoryResult?: number | null
}

@ObjectType()
export class ReportUpdateResponse extends DefaultMutationResponse {
  @Field(() => Report, { nullable: true })
  record?: Report
}

export enum ReportSort {
  STATE_NUMBER_ASC = "stateNumber_ASC",
  STATE_NUMBER_DESC = "stateNumber_DESC",
  TOTAL_MILEAGE_ASC = "totalMileage_ASC",
  TOTAL_MILEAGE_DESC = "totalMileage_DESC",
  LUBRICANT_MILEAGE_ASC = "lubricantMileage_ASC",
  LUBRICANT_MILEAGE_DESC = "lubricantMileage_DESC",
  SAMPLING_NODES_ASC = "samplingNodes_ASC",
  SAMPLING_NODES_DESC = "samplingNodes_DESC",
  SAMPLED_AT_ASC = "sampledAt_ASC",
  SAMPLED_AT_DESC = "sampledAt_DESC",
  ID_ASC = "id_ASC",
  ID_DESC = "id_DESC",
  NUMBER_ASC = "number_ASC",
  NUMBER_DESC = "number_DESC",
  COLOR_ASC = "color_ASC",
  COLOR_DESC = "color_DESC"
}

registerEnumType(ReportSort, {
  name: 'ReportSort'
})

@InputType()
export class ReportFilter extends BaseFilter {
  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  color?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => LubricantFilter)
  lubricantEntity?: LubricantFilter

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  totalMileage?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  lubricantMileage?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => UserFilter)
  client?: UserFilter

  @Field({ nullable: true })
  @Type(() => VehicleFilter)
  vehicle?: VehicleFilter

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  samplingNodes?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => DateFilterOperator)
  sampledAt?: DateFilterOperator

  @Field({ nullable: true })
  @Type(() => NumberFilterOperator)
  id?: NumberFilterOperator
}

@ArgsType()
export class ReportPaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [ReportSort], { nullable: true })
  sort?: ReportSort[]

  @Field(() => ReportFilter, { nullable: true })
  @Type(() => ReportFilter)
  filter?: ReportFilter
}

@ObjectType()
export class ReportPaginateResponse extends PaginatedResponse {
  @Field(() => [Report])
  items: Report[]
}

@ArgsType()
export class ReportGeneratePdfArgs {
  @Field(() => [ReportSort], { nullable: true })
  sort?: ReportSort[]

  @Field(() => ReportFilter, { nullable: true })
  @Type(() => ReportFilter)
  filter?: ReportFilter
}

@ObjectType()
export class ReportGeneratePdfResponse extends DefaultMutationResponse {
  @Field(() => File, { nullable: true })
  record?: File
}
