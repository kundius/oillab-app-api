import { Field, ObjectType } from '@nestjs/graphql'

import { DefaultError } from './errors/DefaultError'

@ObjectType()
export class DefaultMutationResponse {
  @Field()
  success: boolean

  @Field(() => DefaultError, { nullable: true })
  error?: DefaultError
}
