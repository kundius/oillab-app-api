import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DateFilter {
  @Field(() => Date, { nullable: true })
  eq?: Date

  @Field(() => Date, { nullable: true })
  lt?: Date

  @Field(() => Date, { nullable: true })
  gt?: Date
}
