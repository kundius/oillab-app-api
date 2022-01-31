import { ObjectType } from '@nestjs/graphql'
import { DefaultError } from './DefaultError'

@ObjectType({ implements: DefaultError })
export class NotAllowedError extends DefaultError {
  constructor (message?: string) {
    super(message || 'Not Allowed Error')
  }
}
