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

import { Report } from '@app/report/entities/report.entity'
import { Maybe } from 'graphql/jsutils/Maybe'

export enum ProductType {
  Fuel = 'Fuel',
  Oil = 'Oil',
  Coolant = 'Coolant'
}

registerEnumType(ProductType, {
  name: 'ProductType'
})

@Entity()
@ObjectType()
export class Lubricant {
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  model: string

  @Field()
  @Column()
  brand: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  viscosity: Maybe<string>

  @Field(() => ProductType, { nullable: true })
  @Column({
    type: 'enum',
    enum: ProductType,
    nullable: true
  })
  productType: ProductType | null

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => [Report], { nullable: 'items' })
  @OneToMany(() => Report, report => report.client)
  reports: Promise<Report[]>
}
