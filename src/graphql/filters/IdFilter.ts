import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class IdFilter {
  @Field({ nullable: true })
  eq?: number

  @Field(() => [Int], { nullable: true })
  in?: [number]
}
