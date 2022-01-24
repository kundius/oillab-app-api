import { Exception } from './Exception'

export abstract class NotFoundException extends Exception {
  public readonly type = 'not_found'
}
