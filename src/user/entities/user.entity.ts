import {
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable
} from 'typeorm'
import {
  Field,
  ObjectType,
  registerEnumType,
  Extensions
} from '@nestjs/graphql'

import { Vehicle } from '@app/vehicle/entities/vehicle.entity'
import { Report } from '@app/report/entities/report.entity'
import { File } from '@app/file/file.entity'

export enum UserRole {
  Member = 'Member',
  Administrator = 'Administrator'
}

registerEnumType(UserRole, {
  name: 'UserRole'
})

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column()
  name: string

  @Field(() => String, { nullable: true })
  @Extensions({ ability: 'readEmail' })
  @Column({ unique: true })
  email: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Member
  })
  role: UserRole

  @Column()
  password: string

  @Field(() => Boolean)
  @Column({ default: false })
  isActive: boolean

  @Field(() => Date)
  @Column({ default: () => 'now()' })
  lastActivityAt: Date

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => [Vehicle])
  @OneToMany(() => Vehicle, vehicle => vehicle.owner, { lazy: true })
  vehicles: Promise<Vehicle[]>

  @Field(() => [Report])
  @OneToMany(() => Report, report => report.client)
  reports: Promise<Report[]>

  @Field(() => [File], { nullable: 'items' })
  @OneToMany(() => File, file => file.user, { lazy: true })
  @JoinTable()
  files: File[]
}
