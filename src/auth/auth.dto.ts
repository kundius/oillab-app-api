import { InputType, Field, ObjectType } from '@nestjs/graphql'
import { User } from '@app/user/entities/user.entity'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'

@ObjectType()
export class SignInResponse extends DefaultMutationResponse {
  @Field({ nullable: true })
  token?: string

  @Field(() => User, { nullable: true })
  record?: User
}

@InputType()
export class SignInInput {
  @Field()
  email: string

  @Field()
  password: string
}
