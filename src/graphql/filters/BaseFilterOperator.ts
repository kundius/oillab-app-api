import { SelectQueryBuilder } from 'typeorm'

export class BaseFilterOperator {
  applyOperator(
    field: string,
    qb: SelectQueryBuilder<unknown>
  ): SelectQueryBuilder<unknown> {
    throw new Error('Operator apply method not implemented')
  }
}
