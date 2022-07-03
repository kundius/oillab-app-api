import {
  OneToOne,
  OneToMany,
  ManyToOne,
  Entity,
  BeforeInsert,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinTable,
  TableInheritance,
  ChildEntity,
  ManyToMany,
  JoinColumn
} from 'typeorm'
import {
  Field,
  ObjectType,
  registerEnumType,
  Extensions,
  Int
} from '@nestjs/graphql'

import { User } from '@app/user/entities/user.entity'
import { Report } from '@app/report/entities/report.entity'
import { Maybe } from 'graphql/jsutils/Maybe'

@Entity()
@ObjectType()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  model: string

  @Column()
  releaseYear: string

  @Column()
  stateNumber: string

  @Column()
  engineModel: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  liquidVolume: Maybe<string>

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => User)
  @ManyToOne(() => User, user => user.vehicles, { lazy: true })
  owner: Promise<User>

  @Field(() => [Report])
  @OneToMany(() => Report, report => report.vehicle)
  reports: Promise<Report[]>
}
