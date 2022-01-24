import { Exception } from './Exception'

abstract class NotFoundException extends Exception {
  public readonly type = 'not_found'
}
