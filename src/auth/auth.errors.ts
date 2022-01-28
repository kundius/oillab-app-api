import { Field, ObjectType } from '@nestjs/graphql'

import { ClientError } from '@app/core/errors/ClientError'

@ObjectType({ implements: ClientError })
export class AuthValidationError extends ClientError {
  @Field()
  public readonly field: string

  constructor(field: string, message: string) {
    super(message)
    this.field = field
  }
}
