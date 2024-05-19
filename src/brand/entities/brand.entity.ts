import { Lubricant } from '@app/lubricant/entities/lubricant.entity'
import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
@ObjectType()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => [Lubricant], { nullable: 'items' })
  @OneToMany(() => Lubricant, (lubricant) => lubricant.brandEntity)
  lubricants: Promise<Lubricant[]>
}
