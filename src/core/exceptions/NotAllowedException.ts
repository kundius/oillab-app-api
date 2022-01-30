import { Exception } from './Exception'

export abstract class NotAllowedException extends Exception {
  public readonly type = 'authorization'
}
