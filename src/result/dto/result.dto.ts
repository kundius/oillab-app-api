import { InputType, Field, Int, ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { Result } from '../entities/result.entity'
import { ResultResearchColor } from '../entities/result-research.entity'
import { ResultIndicatorColor } from '../entities/result-indicator.entity'
import { StringFilterOperator } from '@app/graphql/filters/StringFilterOperator'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { IdFilterOperator } from '@app/graphql/filters/IdFilterOperator'
import { BaseFilter } from '@app/graphql/filters/BaseFilter'

@InputType()
export class ResultCreateInput {
  @Field()
  formNumber: string

  @Field()
  oilTypeId: number
}

@ObjectType()
export class ResultCreateResponse extends DefaultMutationResponse {
  @Field(() => Result, { nullable: true })
  record?: Result
}

@InputType()
export class ResultUpdateIndicatorValue {
  @Field()
  value: string
  
  @Field(() => ResultIndicatorColor)
  color: ResultIndicatorColor

  @Field()
  oilTypeIndicatorId: number
}

@InputType()
export class ResultUpdateResearchValue {
  @Field()
  value: string
  
  @Field(() => ResultResearchColor)
  color: ResultResearchColor

  @Field()
  oilTypeResearchId: number
}

@InputType()
export class ResultUpdateInput {
  @Field()
  interpretation: string
  
  @Field(() => [ResultUpdateIndicatorValue])
  values: ResultUpdateIndicatorValue[]

  @Field(() => [ResultUpdateResearchValue])
  researches: ResultUpdateResearchValue[]
}

@ObjectType()
export class ResultUpdateResponse extends DefaultMutationResponse {
  @Field(() => Result, { nullable: true })
  record?: Result
}

export enum ResultSort {
  ID_ASC = "id_ASC",
  ID_DESC = "id_DESC",
}

registerEnumType(ResultSort, {
  name: 'ResultSort'
})

@InputType()
export class ResultFilter extends BaseFilter {
  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  formNumber?: StringFilterOperator
}

@ArgsType()
export class ResultPaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [ResultSort], { nullable: true })
  sort?: ResultSort[]

  @Field(() => ResultFilter, { nullable: true })
  @Type(() => ResultFilter)
  filter?: ResultFilter
}

@ObjectType()
export class ResultPaginateResponse extends PaginatedResponse {
  @Field(() => [Result])
  items: Result[]
}
