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
}
