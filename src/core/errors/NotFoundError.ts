import { InterfaceType } from '@nestjs/graphql'
import { Error } from './Error'

@InterfaceType({
  isAbstract: true,
  implements: Error
})
export abstract class NotFoundError extends Error {
  public readonly type = 'not_found'
}
