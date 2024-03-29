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

@Entity()
@ObjectType()
export class OilTypeResearch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @ManyToOne(() => OilType, (oilType) => oilType.researches)
  oilType: Promise<OilType>
}
