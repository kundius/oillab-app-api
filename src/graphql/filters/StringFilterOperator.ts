import { Field, InputType } from '@nestjs/graphql'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { BaseFilterOperator } from './BaseFilterOperator'

@InputType()
export class StringFilterOperator extends BaseFilterOperator {
  @Field({ nullable: true })
  eq?: string

  @Field({ nullable: true })
  contains?: string

  applyOperator(field: string, qb: SelectQueryBuilder<ObjectLiteral>) {
    for (let key of Object.keys(this)) {
      switch (key) {
        case 'eq':
          qb.andWhere(`${field} LIKE :${field}Eq`, {
            [`${field}Eq`]: this[key]
          })
          break
        case 'contains':
          qb.andWhere(`${field} LIKE :${field}Contains`, {
            [`${field}Contains`]: `%${this[key]}%`
          })
          break
        default:
          throw new Error('Unknown operator field')
      }
    }
    return qb
  }
}
