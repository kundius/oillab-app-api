import { InputType, Field, Int, ID, ArgsType, ObjectType, registerEnumType, Float } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { StringFilter } from '@app/graphql/filters/StringFilter'
import { User } from '@app/user/entities/user.entity'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'

@InputType()
export class UserCreateInput {
  @Field()
  password: string

  @Field()
  name: string

  @Field()
  email: string
}

@ObjectType()
export class UserCreateResponse extends DefaultMutationResponse {
  @Field(() => User, { nullable: true })
  record?: User
}

@InputType()
export class UserUpdateInput {
  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string
}

@ObjectType()
export class UserUpdateResponse extends DefaultMutationResponse {
  @Field(() => User, { nullable: true })
  record?: User
}

export enum UserSort {
  ID_ASC,
  ID_DESC,
  NAME_ASC,
  NAME_DESC,
  EMAIL_ASC,
  EMAIL_DESC
}

registerEnumType(UserSort, {
  name: 'UserSort'
})

@InputType()
export class UserFilter {
  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter

  @Field(() => StringFilter, { nullable: true })
  email?: StringFilter
}

@ArgsType()
export class UserPaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [UserSort], { nullable: true })
  sort?: UserSort[]

  @Field(() => UserFilter, { nullable: true })
  @Type(() => UserFilter)
  filter?: UserFilter
}

@ObjectType()
export class UserPaginateResponse extends PaginatedResponse {
  @Field(() => [User])
  items: User[]
}
