import { Field, InterfaceType } from '@nestjs/graphql'

@InterfaceType()
export class DefaultError {
  @Field()
  message: string

  constructor (message: string) {
    this.message = message
  }
}
