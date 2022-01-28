import { Field, ObjectType, Int } from '@nestjs/graphql'

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  total: number

  @Field(() => Int)
  page: number

  @Field(() => Int)
  perPage: number
}

@ObjectType({ isAbstract: true })
export abstract class PaginatedResponse {
  @Field(() => PageInfo)
  pageInfo: PageInfo

  abstract items: any[]
}
