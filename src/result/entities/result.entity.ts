import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  BaseEntity
} from 'typeorm'
import {
  Field,
  ObjectType
} from '@nestjs/graphql'

import { ResultIndicator } from './result-indicator.entity'
import { OilType } from '@app/oil-type/entities/oil-type.entity'
import { ResultResearch } from './result-research.entity'

@Entity()
@ObjectType()
export class Result extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  formNumber: string

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => OilType)
  @ManyToOne(() => OilType, (oilType) => oilType.results)
  oilType: Promise<OilType>

  @OneToMany(() => ResultIndicator, (oilTypeIndicator) => oilTypeIndicator.result)
  indicators: Promise<ResultIndicator[]>

  @OneToMany(() => ResultResearch, (oilTypeResearch) => oilTypeResearch.result)
  researches: Promise<ResultResearch[]>
}
