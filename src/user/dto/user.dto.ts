import { InputType, Field, Int, ID, ArgsType, ObjectType, registerEnumType, Float } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { StringFilter } from '@app/graphql/filters/StringFilter'
import { User, UserRole } from '@app/user/entities/user.entity'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'

@InputType()
export class UserCreateInput {
  @Field()
  password: string

  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  organization?: string

  @Field({ nullable: true })
  phone?: string

  @Field()
  role: UserRole
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

  @Field({ nullable: true })
  organization?: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  role?: UserRole
}

@ObjectType()
export class UserUpdateResponse extends DefaultMutationResponse {
  @Field(() => User, { nullable: true })
  record?: User
}

export enum UserSort {
  ID_ASC = "id_ASC",
  ID_DESC = "id_DESC",
  NAME_ASC = "name_ASC",
  NAME_DESC = "name_DESC",
  EMAIL_ASC = "email_ASC",
  EMAIL_DESC = "email_DESC",
  ORGANIZATION_ASC = "organization_ASC",
  ORGANIZATION_DESC = "organization_DESC",
  PHONE_ASC = "phone_ASC",
  PHONE_DESC = "phone_DESC"
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

  @Field(() => StringFilter, { nullable: true })
  organization?: StringFilter

  @Field(() => StringFilter, { nullable: true })
  phone?: StringFilter
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
