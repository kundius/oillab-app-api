import { ObjectType } from '@nestjs/graphql'
import { DefaultError } from './DefaultError'

@ObjectType({ implements: DefaultError })
export class AuthenticationError extends DefaultError {
  constructor (message?: string) {
    super(message || 'Authentication Error')
  }
}
