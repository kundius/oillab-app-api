import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity
} from 'typeorm'
import {
  Field,
  ObjectType
} from '@nestjs/graphql'

import { Result } from './result.entity'
import { OilTypeIndicator } from '@app/oil-type/entities/oil-type-indicator.entity'

@Entity()
@ObjectType()
export class ResultIndicator extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  value: string | null

  @Field(() => Result)
  @ManyToOne(() => Result)
  result: Promise<Result | null>

  @Field(() => OilTypeIndicator)
  @ManyToOne(() => OilTypeIndicator)
  oilTypeIndicator: Promise<OilTypeIndicator | null>
}
