import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm'
import {
  Field,
  ObjectType
} from '@nestjs/graphql'

import { Result } from './result.entity'
import { OilTypeIndicator } from './oil-type-indicator.entity'

@Entity()
@ObjectType()
export class ResultIndicator {
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
