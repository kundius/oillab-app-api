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
import { OilTypeResearch } from '@app/oil-type/entities/oil-type-research.entity'

export enum ResultResearchColor {
  Green = 'Green',
  Yellow = 'Yellow',
  Red = 'Red',
  White = 'White'
}

registerEnumType(ResultResearchColor, {
  name: 'ResultResearchColor'
})

@Entity()
@ObjectType()
export class ResultResearch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  value: string | null

  @Field(() => ResultResearchColor)
  @Column({
    type: 'enum',
    enum: ResultResearchColor,
    nullable: true
  })
  color: ResultResearchColor | null

  @Field(() => Result)
  @ManyToOne(() => Result)
  result: Promise<Result | null>

  @Field(() => OilTypeResearch)
  @ManyToOne(() => OilTypeResearch)
  oilTypeResearch: Promise<OilTypeResearch | null>
}
