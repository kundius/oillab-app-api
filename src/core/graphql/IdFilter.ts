import { Field, InputType, Int } from '@nestjs/graphql'

import * as filters from '@app/core/types/filters'

@InputType()
export class IdFilter implements filters.IdFilter {
  @Field({ nullable: true })
  eq?: number

  @Field(() => [Int], { nullable: true })
  in?: [number]
}
