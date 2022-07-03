import { InputType, Field, Int, ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { Lubricant, ProductType } from '@app/lubricant/entities/lubricant.entity'
import { StringFilterOperator } from '@app/graphql/filters/StringFilterOperator'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { IdFilterOperator } from '@app/graphql/filters/IdFilterOperator'
import { BaseFilter } from '@app/graphql/filters/BaseFilter'

@InputType()
export class LubricantCreateInput {
  @Field({ nullable: true })
  productType?: ProductType

  @Field()
  model: string

  @Field()
  brand: string

  @Field({ nullable: true })
  viscosity?: string
}

@ObjectType()
export class LubricantCreateResponse extends DefaultMutationResponse {
  @Field(() => Lubricant, { nullable: true })
  record?: Lubricant
}

@InputType()
export class LubricantUpdateInput {
  @Field({ nullable: true })
  productType?: ProductType

  @Field({ nullable: true })
  model?: string

  @Field({ nullable: true })
  brand?: string

  @Field({ nullable: true })
  viscosity?: string
}

@ObjectType()
export class LubricantUpdateResponse extends DefaultMutationResponse {
  @Field(() => Lubricant, { nullable: true })
  record?: Lubricant
}

export enum LubricantSort {
  MODEL_ASC = "model_ASC",
  MODEL_DESC = "model_DESC",
  BRAND_ASC = "brand_ASC",
  BRAND_DESC = "brand_DESC",
  VISCOSITY_ASC = "viscosity_ASC",
  VISCOSITY_DESC = "viscosity_DESC",
}

registerEnumType(LubricantSort, {
  name: 'LubricantSort'
})

@InputType()
export class LubricantFilter extends BaseFilter {
  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  model?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  brand?: StringFilterOperator

  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  viscosity?: StringFilterOperator
}

@ArgsType()
export class LubricantPaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [LubricantSort], { nullable: true })
  sort?: LubricantSort[]

  @Field(() => LubricantFilter, { nullable: true })
  @Type(() => LubricantFilter)
  filter?: LubricantFilter
}

@ObjectType()
export class LubricantPaginateResponse extends PaginatedResponse {
  @Field(() => [Lubricant])
  items: Lubricant[]
}
