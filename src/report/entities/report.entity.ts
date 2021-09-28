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
import { Vehicle } from '@app/vehicle/entities/vehicle.entity'
import { File } from '@app/file/file.entity'

@Entity()
@ObjectType()
export class Report {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  number: number

  @Column()
  lubricant: string

  @Column()
  totalMileage: string

  @Column()
  lubricantMileage: string

  @Column()
  samplingNodes: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  note: string | null

  @Field(() => Date)
  @CreateDateColumn()
  sampledAt: Date

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, user => user.reports, { nullable: true })
  client: Promise<User | null>

  @Field(() => Vehicle, { nullable: true })
  @ManyToOne(() => Vehicle, vehicle => vehicle.reports, { nullable: true })
  vehicle: Promise<Vehicle | null>

  @Field(() => File, { nullable: true })
  @ManyToOne(() => File, { nullable: true })
  laboratoryResult: Promise<File | null>

  @Field(() => File, { nullable: true })
  @ManyToOne(() => File, { nullable: true })
  expressLaboratoryResult: Promise<File | null>
}
