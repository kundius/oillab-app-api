import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export class BaseFilterOperator {
  applyOperator(
    field: string,
    qb: SelectQueryBuilder<ObjectLiteral>
  ): SelectQueryBuilder<ObjectLiteral> {
    throw new Error('Operator apply method not implemented')
  }
}
