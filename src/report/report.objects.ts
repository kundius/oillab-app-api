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
import { DateFilter } from '@app/core/graphql/DateFilter'
import { NumberFilter } from '@app/core/graphql/NumberFilter'
import { File } from '@app/file/file.entity'

import { Report } from './entities/report.entity'
import * as types from './report.types'
import * as errors from './report.errors'

@InputType()
export class ReportCreateInput implements types.ReportCreateInput {
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
  expressLaboratoryResult?: number | null

  @Field(() => Int, { nullable: true })
  laboratoryResult?: number | null
}

export const ReportCreateError = createUnionType({
  name: 'ReportCreateError',
  types: () => [errors.ReportCreateNotAllowedError]
})

@ObjectType()
export class ReportCreateResponse {
  @Field()
  success: boolean

  @Field(() => Report, { nullable: true })
  record?: Report

  @Field(() => ReportCreateError, { nullable: true })
  error?: typeof ReportCreateError
}

@InputType()
export class ReportUpdateInput implements types.ReportUpdateInput {
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
  expressLaboratoryResult?: number | null

  @Field(() => Int, { nullable: true })
  laboratoryResult?: number | null
}

export const ReportUpdateError = createUnionType({
  name: 'ReportUpdateError',
  types: () => [errors.ReportUpdateNotAllowedError, errors.ReportNotFoundError]
})

@ObjectType()
export class ReportUpdateResponse {
  @Field()
  success: boolean

  @Field(() => Report, { nullable: true })
  record?: Report

  @Field(() => ReportUpdateError, { nullable: true })
  error?: typeof ReportUpdateError
}

export const ReportDeleteError = createUnionType({
  name: 'ReportDeleteError',
  types: () => [errors.ReportDeleteNotAllowedError, errors.ReportNotFoundError]
})

@ObjectType()
export class ReportDeleteResponse {
  @Field()
  success: boolean

  @Field(() => ReportDeleteError, { nullable: true })
  error?: typeof ReportDeleteError
}

registerEnumType(types.ReportSort, {
  name: 'ReportSort'
})

@InputType()
export class ReportFilter implements types.ReportFilter {
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
export class ReportPaginateArgs implements types.ReportPaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [types.ReportSort], { nullable: true })
  sort?: types.ReportSort[]

  @Field(() => ReportFilter, { nullable: true })
  @Type(() => ReportFilter)
  filter?: ReportFilter
}

@ObjectType()
export class ReportPaginateResponse
  extends PaginatedResponse
  implements types.ReportPaginatedResult
{
  @Field(() => [Report])
  items: Report[]
}

@ArgsType()
export class ReportGeneratePdfArgs implements types.ReportGeneratePdfArgs {
  @Field(() => [types.ReportSort], { nullable: true })
  sort?: types.ReportSort[]

  @Field(() => ReportFilter, { nullable: true })
  @Type(() => ReportFilter)
  filter?: ReportFilter
}

export const ReportGeneratePdfError = createUnionType({
  name: 'ReportGeneratePdfError',
  types: () => [errors.ReportGeneratePdfNotAllowedError]
})

@ObjectType()
export class ReportGeneratePdfResponse {
  @Field(() => File, { nullable: true })
  record?: File

  @Field()
  success: boolean

  @Field(() => ReportGeneratePdfError, { nullable: true })
  error?: typeof ReportGeneratePdfError
}
