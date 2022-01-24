import { Exception } from './Exception'

abstract class ClientException extends Exception {
  public readonly type = 'client'
}
