import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinTable } from 'typeorm'
import { ObjectType, ID, Field } from '@nestjs/graphql'

import { User } from '@app/user/entities/user.entity'

@Entity()
@ObjectType()
export class File {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => String)
  @Column()
  name: string

  @Field(() => String)
  @Column()
  path: string

  @Field(() => String)
  @Column()
  url: string

  @Field(() => Number)
  @Column()
  size: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  type: string | null

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, user => user.files, { nullable: true })
  @JoinTable()
  user: Promise<User | null>
}
