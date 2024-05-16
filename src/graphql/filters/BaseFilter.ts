import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export class BaseFilter {
  applyFilter(
    tableName: string,
    qb: SelectQueryBuilder<ObjectLiteral>
  ): SelectQueryBuilder<ObjectLiteral> {
    for (let key of Object.keys(this)) {
      if (this[key] instanceof BaseFilter) {
        qb.leftJoinAndSelect(`${tableName}.${key}`, key)
        this[key].applyFilter(key, qb)
      } else {
        this[key].applyOperator(`${tableName}.${key}`, qb)
      }
    }
    return qb
  }
}
