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
import { Lubricant } from '@app/lubricant/entities/lubricant.entity'
import { Report } from './report.entity'

@Entity()
@ObjectType()
export class ReportApplicationForm {
  @PrimaryGeneratedColumn()
  id: number

  // @Field(() => String, { nullable: true })
  // @Column({ type: 'text', nullable: true })
  // vehicleEquipmentManufacturer: string | null

  // @Field(() => String, { nullable: true })
  // @Column({ type: 'text', nullable: true })
  // vehicleRegistrationNumber: string | null

  // @Field(() => String, { nullable: true })
  // @Column({ type: 'text', nullable: true })
  // vehicleEquipmentModel: string | null

  // @Field(() => String, { nullable: true })
  // @Column({ type: 'text', nullable: true })
  // vehicleTotalOperatingTime: string | null
  
  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  vehicleSamplingPoint: string | null

  // @Field(() => String, { nullable: true })
  // @Column({ type: 'text', nullable: true })
  // vehicleTotalOperatingTimeLubricant: string | null

  // @Field(() => String, { nullable: true })
  // @Column({ type: 'text', nullable: true })
  // vehicleLiquidVolume: string | null

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  vehicleToppingUpLubricant: string | null

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  lubricantState: string | null

  // @Field(() => String, { nullable: true })
  // @Column({ type: 'text', nullable: true })
  // selectionBrand: string | null

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  selectionVolume: string | null

  // @Field(() => String, { nullable: true })
  // @Column({ type: 'text', nullable: true })
  // selectionPlace: string | null

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  note: string | null

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => Report, { nullable: true })
  @OneToOne(() => Report, report => report.applicationForm)
  report: Promise<Report | null>
}
