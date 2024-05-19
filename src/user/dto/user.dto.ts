import { InputType, Field, Int, ID, ArgsType, ObjectType, registerEnumType, Float } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { StringFilterOperator } from '@app/graphql/filters/StringFilterOperator'
import { User, UserRole } from '@app/user/entities/user.entity'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { BaseFilter } from '@app/graphql/filters/BaseFilter'

@InputType()
export class UserCreateInput {
  @Field()
  password: string

  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  contactPerson?: string

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
  contactPerson?: string

  @Field({ nullable: true })
  phone?: string

  @Field(() => UserRole, { nullable: true })
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
  CONTACT_PERSON_ASC = "contactPerson_ASC",
  CONTACT_PERSON_DESC = "contactPerson_DESC",
  PHONE_ASC = "phone_ASC",
  PHONE_DESC = "phone_DESC"
}

registerEnumType(UserSort, {
  name: 'UserSort'
})

@InputType()
export class UserFilter extends BaseFilter {
  @Field(() => StringFilterOperator, { nullable: true })
  @Type(() => StringFilterOperator)
  name?: StringFilterOperator

  @Field(() => StringFilterOperator, { nullable: true })
  @Type(() => StringFilterOperator)
  email?: StringFilterOperator

  @Field(() => StringFilterOperator, { nullable: true })
  @Type(() => StringFilterOperator)
  contactPerson?: StringFilterOperator

  @Field(() => StringFilterOperator, { nullable: true })
  @Type(() => StringFilterOperator)
  phone?: StringFilterOperator
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

@ObjectType()
export class UserAddBrandResponse extends DefaultMutationResponse {
  @Field(() => User, { nullable: true })
  record?: User
}

@ObjectType()
export class UserRemoveBrandResponse extends DefaultMutationResponse {
  @Field(() => User, { nullable: true })
  record?: User
}
