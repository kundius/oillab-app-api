import {
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  VirtualColumn
} from 'typeorm'
import {
  Field,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql'

import { Report } from '@app/report/entities/report.entity'
import { Maybe } from 'graphql/jsutils/Maybe'
import { Brand } from '@app/brand/entities/brand.entity'

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

  // @Field()
  // @Column()
  // brand: string

  // @Field(() => String)
  // // @Property({ persist: false })
  // // get brand() {
  // //   return (await this.brandEntity)?.name || ''
  // // }
  // @VirtualColumn({ query: (alias) => `SELECT "name" FROM "brand" WHERE "brand.id" = ${alias}.brandEntityId` })
  // brand: string

  @Field(() => Brand, { nullable: true })
  @ManyToOne(() => Brand, brand => brand.lubricants, { nullable: true })
  brandEntity: Promise<Brand | null>

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
