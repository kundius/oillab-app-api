import { ObjectType } from '@nestjs/graphql'
import { DefaultError } from './DefaultError'

@ObjectType({ implements: DefaultError })
export class ServerError extends DefaultError {
  constructor (message?: string) {
    super(message || 'Server Error')
  }
}
