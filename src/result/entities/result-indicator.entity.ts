import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity
} from 'typeorm'
import {
  Field,
  registerEnumType,
  ObjectType
} from '@nestjs/graphql'

import { Result } from './result.entity'
import { OilTypeIndicator } from '@app/oil-type/entities/oil-type-indicator.entity'

export enum ResultIndicatorColor {
  Green = 'Green',
  Yellow = 'Yellow',
  Red = 'Red',
  White = 'White'
}

registerEnumType(ResultIndicatorColor, {
  name: 'ResultIndicatorColor'
})

@Entity()
@ObjectType()
export class ResultIndicator extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  value: string | null

  @Field(() => ResultIndicatorColor)
  @Column({
    type: 'enum',
    enum: ResultIndicatorColor,
    nullable: true
  })
  color: ResultIndicatorColor | null

  @Field(() => Result)
  @ManyToOne(() => Result)
  result: Promise<Result | null>

  @Field(() => OilTypeIndicator)
  @ManyToOne(() => OilTypeIndicator)
  oilTypeIndicator: Promise<OilTypeIndicator | null>
}
