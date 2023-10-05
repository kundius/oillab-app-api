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

import { OilTypeIndicator } from '@app/oil-type/entities/oil-type-indicator.entity'
import { Result } from './result.entity'

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
