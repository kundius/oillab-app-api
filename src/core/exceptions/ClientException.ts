import { Exception } from './Exception'

export abstract class ClientException extends Exception {
  public readonly type = 'client'
}
