import { Field, InputType, Int } from '@nestjs/graphql'
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'
import { BaseFilterOperator } from './BaseFilterOperator'

@InputType()
export class IdFilterOperator extends BaseFilterOperator {
  @Field({ nullable: true })
  eq?: number;

  @Field(() => [Int], { nullable: true })
  in?: [number]

  applyOperator(field: string, qb: SelectQueryBuilder<ObjectLiteral>) {
    for (let key of Object.keys(this)) {
      switch (key) {
        case 'eq':
          qb.andWhere(`${field} = :${field}Eq`, {
            [`${field}Eq`]: this[key]
          })
          break
        case 'in':
          qb.andWhere(`${field} in :...${field}In`, {
            [`${field}In`]: this[key]
          })
          break
        default:
          throw new Error('Unknown operator field')
      }
    }
    return qb
  }
}
