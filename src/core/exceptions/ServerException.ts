import { Exception } from './Exception'

abstract class ServerException extends Exception {
  public readonly type = 'server'
}
