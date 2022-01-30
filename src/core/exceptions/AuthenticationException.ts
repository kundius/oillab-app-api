import { Exception } from './Exception'

export abstract class AuthenticationException extends Exception {
  public readonly type = 'authentication'
}
