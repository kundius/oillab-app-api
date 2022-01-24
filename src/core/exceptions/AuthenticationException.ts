import { Exception } from './Exception'

abstract class AuthenticationException extends Exception {
  public readonly type = 'authentication'
}
