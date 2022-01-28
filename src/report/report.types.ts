import { StringFilter, NumberFilter, DateFilter } from '@app/core/types/filters'
import { PaginatedResult } from '@app/core/types/result'

import { Report } from './entities/report.entity'
import * as errors from './report.errors'

export interface ReportCreateInput {
  lubricant: string
  totalMileage: string
  lubricantMileage: string
  samplingNodes: string
  note?: string
  sampledAt: Date
  client?: number
  vehicle?: number
  expressLaboratoryResult?: number | null
  laboratoryResult?: number | null
}

export interface ReportUpdateInput {
  lubricant?: string
  totalMileage?: string
  lubricantMileage?: string
  samplingNodes?: string
  note?: string
  sampledAt?: Date
  client?: number
  vehicle?: number
  expressLaboratoryResult?: number | null
  laboratoryResult?: number | null
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
  ID_ASC,
  ID_DESC
}

export interface ReportFilter {
  lubricant?: StringFilter
  totalMileage?: StringFilter
  lubricantMileage?: StringFilter
  clientName?: StringFilter
  vehicleModel?: StringFilter
  vehicleStateNumber?: StringFilter
  vehicleReleaseYear?: StringFilter
  vehicleEngineModel?: StringFilter
  samplingNodes?: StringFilter
  sampledAt?: DateFilter
  id?: NumberFilter
}

export interface ReportPaginateArgs {
  perPage: number
  page: number
  sort?: ReportSort[]
  filter?: ReportFilter
}

export interface ReportGeneratePdfArgs {
  sort?: ReportSort[]
  filter?: ReportFilter
}

export type ReportPaginatedResult = PaginatedResult<Report>

export type ReportUpdateErrors =
  | errors.ReportUpdateNotAllowedError
  | errors.ReportNotFoundError

export type ReportDeleteErrors =
  | errors.ReportDeleteNotAllowedError
  | errors.ReportNotFoundError

export type ReportCreateErrors =
  | errors.ReportCreateNotAllowedError

export type ReportGeneratePdfErrors = errors.ReportGeneratePdfNotAllowedError
