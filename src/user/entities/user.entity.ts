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

import { Vehicle } from '@app/vehicle/entities/vehicle.entity'
import { Report } from '@app/report/entities/report.entity'
import { File } from '@app/file/file.entity'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Brand } from '@app/brand/entities/brand.entity'

export enum UserRole {
  Member = 'Member',
  Administrator = 'Administrator',
  Manager = 'Manager'
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

  @Field(() => String)
  @Extensions({ ability: 'readEmail' })
  @Column({ unique: true })
  email: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  contactPerson: Maybe<string>

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  phone: Maybe<string>

  @Field(() => UserRole)
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

  @Field(() => [Vehicle], { nullable: 'items' })
  @OneToMany(() => Vehicle, (vehicle) => vehicle.owner)
  vehicles: Promise<Vehicle[]>

  @Field(() => [Report], { nullable: 'items' })
  @OneToMany(() => Report, (report) => report.client)
  reports: Promise<Report[]>

  @Field(() => [File], { nullable: 'items' })
  @OneToMany(() => File, (file) => file.user)
  @JoinTable()
  files: Promise<File[]>

  @Field(() => [Brand], { nullable: false })
  @ManyToMany(() => Brand, (brand) => brand.users)
  @JoinTable()
  brands: Promise<Brand[]>
}
