import { InputType, Field, ObjectType, Int, ArgsType } from '@nestjs/graphql'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { OilTypeResearch } from '../entities/oil-type-research.entity'

@InputType()
export class OilTypeResearchCreateInput {
  @Field()
  name: string
}

@ObjectType()
export class OilTypeResearchCreateResponse extends DefaultMutationResponse {
  @Field(() => OilTypeResearch, { nullable: true })
  record?: OilTypeResearch
}

@InputType()
export class OilTypeResearchUpdateInput {
  @Field({ nullable: true })
  name?: string
}

@ObjectType()
export class OilTypeResearchUpdateResponse extends DefaultMutationResponse {
  @Field(() => OilTypeResearch, { nullable: true })
  record?: OilTypeResearch
}

@ArgsType()
export class OilTypeResearchListArgs {
  @Field(() => Int)
  oilTypeId: number
}

@ObjectType()
export class OilTypeResearchListResponse {
  @Field(() => [OilTypeResearch])
  items: OilTypeResearch[]
}
