import {
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import {
  Field,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql'

import { Maybe } from 'graphql/jsutils/Maybe'
import { OilTypeIndicator } from './oil-type-indicator.entity'
import { OilTypeResearch } from './oil-type-research.entity'
import { Result } from '@app/result/entities/result.entity'
import { Report } from '@app/report/entities/report.entity'

@Entity()
@ObjectType()
export class OilType {
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field(() => Boolean)
  @Column({ default: false })
  standard: boolean

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => [OilTypeIndicator], { nullable: 'items' })
  @OneToMany(() => OilTypeIndicator, (oilTypeIndicator) => oilTypeIndicator.oilType)
  indicators: Promise<OilTypeIndicator[]>

  @Field(() => [OilTypeResearch], { nullable: 'items' })
  @OneToMany(() => OilTypeResearch, (oilTypeResearch) => oilTypeResearch.oilType)
  researches: Promise<OilTypeResearch[]>

  @Field(() => [Result], { nullable: 'items' })
  @OneToMany(() => Result, (result) => result.oilType)
  results: Promise<Result[]>

  @Field(() => [Report], { nullable: 'items' })
  @OneToMany(() => Report, report => report.oilType)
  reports: Promise<Report[]>
}
