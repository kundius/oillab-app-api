import { InterfaceType } from "@nestjs/graphql"
import { Error } from './Error'

@InterfaceType({
  isAbstract: true,
  implements: Error
})
export abstract class AuthenticationError extends Error {
  public readonly type = 'authentication'
}
