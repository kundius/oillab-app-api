import { InputType, Field, Int, ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { Report } from '@app/report/entities/report.entity'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { StringFilter } from '@app/graphql/StringFilter'
import { DateFilter } from '@app/graphql/DateFilter'
import { NumberFilter } from '@app/graphql/NumberFilter'

@InputType()
export class ReportCreateInput {
  @Field()
  lubricant: string

  @Field()
  stateNumber: string

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

  @Field()
  client: string

  @Field()
  vehicle: string

  @Field({ nullable: true })
  expressLaboratoryResult?: string | null

  @Field({ nullable: true })
  laboratoryResult?: string | null
}

@ObjectType()
export class ReportCreateResponse extends DefaultMutationResponse {
  @Field(() => Report, { nullable: true })
  record?: Report
}

@InputType()
export class ReportUpdateInput {
  @Field({ nullable: true })
  lubricant?: string

  @Field({ nullable: true })
  stateNumber?: string

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

  @Field({ nullable: true })
  client?: string

  @Field({ nullable: true })
  vehicle?: string

  @Field({ nullable: true })
  expressLaboratoryResult?: string | null

  @Field({ nullable: true })
  laboratoryResult?: string | null
}

@ObjectType()
export class ReportUpdateResponse extends DefaultMutationResponse {
  @Field(() => Report, { nullable: true })
  record?: Report
}

export enum ReportSort {
  LUBRICANT_ASC,
  LUBRICANT_DESC,
  STATE_NUMBER_ASC,
  STATE_NUMBER_DESC,
  TOTAL_MILEAGE_ASC,
  TOTAL_MILEAGE_DESC,
  LUBRICANT_MILEAGE_ASC,
  LUBRICANT_MILEAGE_DESC,
  SAMPLING_NODES_ASC,
  SAMPLING_NODES_DESC,
  SAMPLED_AT_ASC,
  SAMPLED_AT_DESC,
  NUMBER_ASC,
  NUMBER_DESC
}

registerEnumType(ReportSort, {
  name: 'ReportSort'
})

@InputType()
export class ReportFilter {
  @Field({ nullable: true })
  lubricant?: StringFilter

  @Field({ nullable: true })
  stateNumber?: StringFilter

  @Field({ nullable: true })
  totalMileage?: StringFilter

  @Field({ nullable: true })
  lubricantMileage?: StringFilter

  @Field({ nullable: true })
  samplingNodes?: StringFilter

  @Field({ nullable: true })
  sampledAt?: DateFilter

  @Field({ nullable: true })
  number?: NumberFilter
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
