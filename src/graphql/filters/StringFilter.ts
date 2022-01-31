import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class StringFilter {
  @Field({ nullable: true })
  eq?: string

  @Field({ nullable: true })
  contains?: string
}
