import { InputType, Field, Int, ArgsType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Type } from 'class-transformer'

import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { OilType } from '../entities/oil-type.entity'
import { StringFilterOperator } from '@app/graphql/filters/StringFilterOperator'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { IdFilterOperator } from '@app/graphql/filters/IdFilterOperator'
import { BaseFilter } from '@app/graphql/filters/BaseFilter'

@InputType()
export class OilTypeCreateInput {
  @Field()
  name: string

  @Field()
  standard: boolean
}

@ObjectType()
export class OilTypeCreateResponse extends DefaultMutationResponse {
  @Field(() => OilType, { nullable: true })
  record?: OilType
}

@InputType()
export class OilTypeUpdateInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  standard?: boolean
}

@ObjectType()
export class OilTypeUpdateResponse extends DefaultMutationResponse {
  @Field(() => OilType, { nullable: true })
  record?: OilType
}

export enum OilTypeSort {
  NAME_ASC = "name_ASC",
  NAME_DESC = "name_DESC",
  ID_ASC = "id_ASC",
  ID_DESC = "id_DESC",
}

registerEnumType(OilTypeSort, {
  name: 'OilTypeSort'
})

@InputType()
export class OilTypeFilter extends BaseFilter {
  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  name?: StringFilterOperator
}

@ArgsType()
export class OilTypePaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [OilTypeSort], { nullable: true })
  sort?: OilTypeSort[]

  @Field(() => OilTypeFilter, { nullable: true })
  @Type(() => OilTypeFilter)
  filter?: OilTypeFilter
}

@ObjectType()
export class OilTypePaginateResponse extends PaginatedResponse {
  @Field(() => [OilType])
  items: OilType[]
}
