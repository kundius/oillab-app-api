import { StringFilter, IdFilter } from '@app/core/types/filters'
import { PaginatedResult } from '@app/core/types/result'

import { Vehicle } from './entities/vehicle.entity'
import * as errors from './vehicle.errors'

export interface VehicleCreateInput {
  model: string
  releaseYear: string
  stateNumber: string
  engineModel: string
  owner: number
}

export interface VehicleUpdateInput {
  model?: string
  releaseYear?: string
  stateNumber?: string
  engineModel?: string
  owner?: number
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

export interface VehicleFilter {
  model?: StringFilter
  releaseYear?: StringFilter
  stateNumber?: StringFilter
  engineModel?: StringFilter
  ownerName?: StringFilter
  ownerId?: IdFilter
}

export interface VehiclePaginateArgs {
  perPage: number
  page: number
  sort?: VehicleSort[]
  filter?: VehicleFilter
}

export type VehiclePaginatedResult = PaginatedResult<Vehicle>

export type VehicleUpdateErrors =
  | errors.VehicleUpdateNotAllowedError
  | errors.VehicleNotFoundError

export type VehicleDeleteErrors =
  | errors.VehicleDeleteNotAllowedError
  | errors.VehicleNotFoundError

export type VehicleCreateErrors = errors.VehicleCreateNotAllowedError
