import { InputType, Field, ObjectType, createUnionType } from '@nestjs/graphql'

import { User } from '@app/user/entities/user.entity'

import * as errors from './auth.errors'

export const SignInError = createUnionType({
  name: 'SignInError',
  types: () => [errors.AuthValidationError]
})

@ObjectType()
export class SignInResponse {
  @Field({ nullable: true })
  token?: string

  @Field(() => User, { nullable: true })
  record?: User

  @Field()
  success: boolean

  @Field(() => SignInError, { nullable: true })
  error?: typeof SignInError
}

@InputType()
export class SignInInput {
  @Field()
  email: string

  @Field()
  password: string
}
