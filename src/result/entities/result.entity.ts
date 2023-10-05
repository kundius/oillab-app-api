import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'
import {
  Field,
  ObjectType
} from '@nestjs/graphql'

import { ResultIndicator } from './result-indicator.entity'
import { OilType } from './oil-type.entity'

@Entity()
@ObjectType()
export class Result {
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  number: string

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => OilType)
  @ManyToOne(() => OilType, (oilType) => oilType.results)
  oilType: Promise<OilType | null>

  @OneToMany(() => ResultIndicator, (oilTypeIndicator) => oilTypeIndicator.result)
  indicators: Promise<ResultIndicator[]>
}
