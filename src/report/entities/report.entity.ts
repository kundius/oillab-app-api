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
import { ReportApplicationForm } from './reportApplicationForm.entity'
import { Lubricant } from '@app/lubricant/entities/lubricant.entity'

export enum ReportColor {
  Red = 'Red',
  Yellow = 'Yellow',
  LightGreen = 'LightGreen'
}

registerEnumType(ReportColor, {
  name: 'ReportColor'
})

@Entity()
@ObjectType()
export class Report {
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => ReportColor, { nullable: true })
  @Column({
    type: 'enum',
    enum: ReportColor,
    nullable: true
  })
  color: ReportColor | null

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', nullable: true })
  number: number | null

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

  @Field(() => Lubricant, { nullable: true })
  @ManyToOne(() => Lubricant, lubricant => lubricant.reports, { nullable: true })
  lubricantEntity: Promise<Lubricant | null>

  @Field(() => File, { nullable: true })
  @ManyToOne(() => File, { nullable: true })
  laboratoryResult: Promise<File | null>

  @Field(() => File, { nullable: true })
  @ManyToOne(() => File, { nullable: true })
  expressLaboratoryResult: Promise<File | null>

  @Field(() => ReportApplicationForm, { nullable: true })
  @OneToOne(() => ReportApplicationForm, applicationForm => applicationForm.report)
  @JoinColumn()
  applicationForm: Promise<ReportApplicationForm | null>
}
