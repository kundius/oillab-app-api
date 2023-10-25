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
import { OilTypeResearch } from '@app/oil-type/entities/oil-type-research.entity'

@Entity()
@ObjectType()
export class ResultResearch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  value: string | null

  @Field(() => Result)
  @ManyToOne(() => Result)
  result: Promise<Result | null>

  @Field(() => OilTypeResearch)
  @ManyToOne(() => OilTypeResearch)
  oilTypeResearch: Promise<OilTypeResearch | null>
}
