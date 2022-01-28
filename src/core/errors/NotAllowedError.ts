import { InterfaceType } from "@nestjs/graphql"
import { Error } from './Error'

@InterfaceType({
  isAbstract: true,
  implements: Error
})
export abstract class NotAllowedError extends Error {
  public readonly type = 'authorization'
}
