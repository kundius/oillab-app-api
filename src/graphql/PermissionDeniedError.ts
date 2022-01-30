import { ObjectType } from '@nestjs/graphql'
import { DefaultError } from './DefaultError'

@ObjectType({ implements: DefaultError })
export class PermissionDeniedError extends DefaultError {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (message: string) {
    super(message)
  }
}
