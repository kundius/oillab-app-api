import { StringFilter, NumberFilter, DateFilter } from '@app/core/types/filters'
import { PaginatedResult } from '@app/core/types/result'

import { User } from './entities/user.entity'
import * as errors from './user.errors'

export interface UserCreateInput {
  password: string
  name: string
  email: string
}

export interface UserUpdateInput {
  password?: string
  name?: string
  email?: string
}

export enum UserSort {
  ID_ASC,
  ID_DESC,
  NAME_ASC,
  NAME_DESC,
  EMAIL_ASC,
  EMAIL_DESC
}

export interface UserFilter {
  name?: StringFilter
  email?: StringFilter
}

export interface UserPaginateArgs {
  perPage: number
  page: number
  sort?: UserSort[]
  filter?: UserFilter
}

export type UserPaginatedResult = PaginatedResult<User>

export type UserUpdateErrors =
  | errors.UserUpdateNotAllowedError
  | errors.UserNotFoundError

export type UserDeleteErrors =
  | errors.UserDeleteNotAllowedError
  | errors.UserNotFoundError

export type UserCreateErrors =
  | errors.UserCreateNotAllowedError
