import {
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity
} from 'typeorm'
import {
  Field,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql'

import { Maybe } from 'graphql/jsutils/Maybe'
import { OilType } from './oil-type.entity'
import { Result } from '@app/result/entities/result.entity'
import { ResultIndicator } from '@app/result/entities/result-indicator.entity'

@Entity()
@ObjectType()
export class OilTypeIndicator extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  ntd: string

  @Field()
  @Column()
  units: string

  @ManyToOne(() => OilType, (oilType) => oilType.indicators)
  oilType: Promise<OilType>

  @OneToMany(() => ResultIndicator, (resultIndicator) => resultIndicator.oilTypeIndicator)
  resultIndicators: Promise<ResultIndicator[]>
}
