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

import { User } from './entities/user.entity'
import * as types from './user.types'
import * as errors from './user.errors'

@InputType()
export class UserCreateInput implements types.UserCreateInput {
  @Field()
  password: string

  @Field()
  name: string

  @Field()
  email: string
}

export const UserCreateError = createUnionType({
  name: 'UserCreateError',
  types: () => [errors.UserCreateNotAllowedError]
})

@ObjectType()
export class UserCreateResponse {
  @Field()
  success: boolean

  @Field(() => User, { nullable: true })
  record?: User

  @Field(() => UserCreateError, { nullable: true })
  error?: typeof UserCreateError
}

@InputType()
export class UserUpdateInput implements types.UserUpdateInput {
  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string
}

export const UserUpdateError = createUnionType({
  name: 'UserUpdateError',
  types: () => [errors.UserUpdateNotAllowedError, errors.UserNotFoundError]
})

@ObjectType()
export class UserUpdateResponse {
  @Field()
  success: boolean

  @Field(() => User, { nullable: true })
  record?: User

  @Field(() => UserUpdateError, { nullable: true })
  error?: typeof UserUpdateError
}

export const UserDeleteError = createUnionType({
  name: 'UserDeleteError',
  types: () => [errors.UserDeleteNotAllowedError, errors.UserNotFoundError]
})

@ObjectType()
export class UserDeleteResponse {
  @Field()
  success: boolean

  @Field(() => UserDeleteError, { nullable: true })
  error?: typeof UserDeleteError
}

registerEnumType(types.UserSort, {
  name: 'UserSort'
})

@InputType()
export class UserFilter implements types.UserFilter {
  @Field({ nullable: true })
  name?: StringFilter

  @Field({ nullable: true })
  email?: StringFilter
}

@ArgsType()
export class UserPaginateArgs implements types.UserPaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [types.UserSort], { nullable: true })
  sort?: types.UserSort[]

  @Field(() => UserFilter, { nullable: true })
  @Type(() => UserFilter)
  filter?: UserFilter
}

@ObjectType()
export class UserPaginateResponse
  extends PaginatedResponse
  implements types.UserPaginatedResult
{
  @Field(() => [User])
  items: User[]
}
