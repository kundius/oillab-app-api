import {
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'
import {
  Field,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql'

import { Maybe } from 'graphql/jsutils/Maybe'
import { OilType } from './oil-type.entity'
import { Result } from '@app/result/entities/result.entity'

@Entity()
@ObjectType()
export class OilTypeIndicator {
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
}
