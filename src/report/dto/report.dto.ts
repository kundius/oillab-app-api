import { InputType, Field, Int, ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { Report, ReportColor } from '@app/report/entities/report.entity'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { StringFilter } from '@app/graphql/filters/StringFilter'
import { DateFilter } from '@app/graphql/filters/DateFilter'
import { NumberFilter } from '@app/graphql/filters/NumberFilter'
import { File } from '@app/file/file.entity'

@InputType()
export class ReportCreateInput {
  @Field({ nullable: true })
  color?: ReportColor

  @Field()
  lubricant: string

  @Field()
  totalMileage: string

  @Field()
  lubricantMileage: string

  @Field()
  samplingNodes: string

  @Field({ nullable: true })
  note?: string

  @Field(() => Date)
  sampledAt: Date

  @Field(() => Int, { nullable: true })
  client?: number

  @Field(() => Int, { nullable: true })
  vehicle?: number

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
  lubricant?: string

  @Field({ nullable: true })
  totalMileage?: string

  @Field({ nullable: true })
  lubricantMileage?: string

  @Field({ nullable: true })
  samplingNodes?: string

  @Field({ nullable: true })
  note?: string

  @Field(() => Date, { nullable: true })
  sampledAt?: Date

  @Field(() => Int, { nullable: true })
  client?: number

  @Field(() => Int, { nullable: true })
  vehicle?: number

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
  LUBRICANT_ASC = "lubricant_ASC",
  LUBRICANT_DESC = "lubricant_DESC",
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
export class ReportFilter {
  @Field({ nullable: true })
  color?: StringFilter

  @Field({ nullable: true })
  lubricant?: StringFilter

  @Field({ nullable: true })
  totalMileage?: StringFilter

  @Field({ nullable: true })
  lubricantMileage?: StringFilter

  @Field({ nullable: true })
  clientName?: StringFilter

  @Field({ nullable: true })
  vehicleModel?: StringFilter

  @Field({ nullable: true })
  vehicleStateNumber?: StringFilter

  @Field({ nullable: true })
  vehicleReleaseYear?: StringFilter

  @Field({ nullable: true })
  vehicleEngineModel?: StringFilter

  @Field({ nullable: true })
  samplingNodes?: StringFilter

  @Field({ nullable: true })
  sampledAt?: DateFilter

  @Field({ nullable: true })
  id?: NumberFilter
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

@InputType()
export class ReportUpdateApplicationFormInput {
  @Field({ nullable: true })
  vehicleEquipmentManufacturer?: string

  @Field({ nullable: true })
  vehicleRegistrationNumber?: string

  @Field({ nullable: true })
  vehicleEquipmentModel?: string

  @Field({ nullable: true })
  vehicleTotalOperatingTime?: string
  
  @Field({ nullable: true })
  vehicleSamplingPoint?: string

  @Field({ nullable: true })
  vehicleTotalOperatingTimeLubricant?: string

  @Field({ nullable: true })
  vehicleLiquidVolume?: string

  @Field({ nullable: true })
  vehicleToppingUpLubricant?: string

  @Field({ nullable: true })
  lubricantState?: string

  @Field({ nullable: true })
  selectionBrand?: string

  @Field({ nullable: true })
  selectionVolume?: string

  @Field({ nullable: true })
  selectionPlace?: string

  @Field({ nullable: true })
  note?: string
}

@ObjectType()
export class ReportUpdateApplicationFormResponse extends DefaultMutationResponse {
  @Field(() => Report, { nullable: true })
  record?: Report
}
