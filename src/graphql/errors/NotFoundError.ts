import { ObjectType } from '@nestjs/graphql'
import { DefaultError } from './DefaultError'

@ObjectType({ implements: DefaultError })
export class NotFoundError extends DefaultError {
  constructor (message?: string) {
    super(message || 'Not Found Error')
  }
}
