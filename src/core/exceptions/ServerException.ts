import { Exception } from './Exception'

export abstract class ServerException extends Exception {
  public readonly type = 'server'
}
