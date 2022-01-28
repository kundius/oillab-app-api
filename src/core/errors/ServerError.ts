import { InterfaceType } from "@nestjs/graphql"
import { Error } from './Error'

@InterfaceType({
  isAbstract: true,
  implements: Error
})
export abstract class ServerError extends Error {
  public readonly type = 'server'
}
