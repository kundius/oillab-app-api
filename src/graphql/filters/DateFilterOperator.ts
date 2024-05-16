import { Field, InputType } from '@nestjs/graphql'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { BaseFilterOperator } from './BaseFilterOperator'

@InputType()
export class DateFilterOperator extends BaseFilterOperator {
  @Field(() => Date, { nullable: true })
  eq?: Date

  @Field(() => Date, { nullable: true })
  lt?: Date

  @Field(() => Date, { nullable: true })
  gt?: Date

  applyOperator(field: string, qb: SelectQueryBuilder<ObjectLiteral>) {
    for (let key of Object.keys(this)) {
      switch (key) {
        case 'eq':
          qb.andWhere(`${field} = :${field}Eq`, {
            [`${field}Eq`]: this[key]
          })
          break
        case 'lt':
          qb.andWhere(`${field} < :${field}Lt`, {
            [`${field}Lt`]: this[key]
          })
          break
        case 'gt':
          qb.andWhere(`${field} > :${field}Gt`, {
            [`${field}Gt`]: this[key]
          })
          break
        default:
          throw new Error('Unknown operator field')
      }
    }
    return qb
  }
}
