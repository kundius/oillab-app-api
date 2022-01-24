import { Exception } from './Exception'

abstract class NotAllowedException extends Exception {
  public readonly type = 'authorization'
}
