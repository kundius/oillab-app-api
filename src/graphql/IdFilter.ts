import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class IdFilter {
  @Field({ nullable: true })
  eq?: string

  @Field(() => [String], { nullable: true })
  in?: [string]
}
