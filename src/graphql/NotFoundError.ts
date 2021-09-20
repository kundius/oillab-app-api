import { ObjectType } from '@nestjs/graphql'
import { DefaultError } from './DefaultError'

@ObjectType({ implements: DefaultError })
export class NotFoundError extends DefaultError {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (message?: string) {
    super(message || 'Not Found')
  }
}
