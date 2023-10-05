import { InputType, Field, ObjectType, Int, ArgsType } from '@nestjs/graphql'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { OilTypeIndicator } from '../entities/oil-type-indicator.entity'

@InputType()
export class OilTypeIndicatorCreateInput {
  @Field()
  name: string

  @Field()
  ntd: string

  @Field()
  units: string
}

@ObjectType()
export class OilTypeIndicatorCreateResponse extends DefaultMutationResponse {
  @Field(() => OilTypeIndicator, { nullable: true })
  record?: OilTypeIndicator
}

@InputType()
export class OilTypeIndicatorUpdateInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  ntd?: string

  @Field({ nullable: true })
  units?: string
}

@ObjectType()
export class OilTypeIndicatorUpdateResponse extends DefaultMutationResponse {
  @Field(() => OilTypeIndicator, { nullable: true })
  record?: OilTypeIndicator
}

@ArgsType()
export class OilTypeIndicatorListArgs {
  @Field(() => Int)
  oilTypeId: number
}

@ObjectType()
export class OilTypeIndicatorListResponse {
  @Field(() => [OilTypeIndicator])
  items: OilTypeIndicator[]
}
