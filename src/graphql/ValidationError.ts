import { Field, ObjectType } from '@nestjs/graphql'
import { DefaultError } from './DefaultError'

@ObjectType({ implements: DefaultError })
export class ValidationError extends DefaultError {
  @Field()
  field: string

  constructor (field: string, message: string) {
    super(message)
    this.field = field
  }
}
