import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class NumberFilter {
  @Field({ nullable: true })
  eq?: number

  @Field({ nullable: true })
  lt?: number

  @Field({ nullable: true })
  gt?: number
}
