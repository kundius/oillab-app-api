import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { PaginatedResponse } from '@app/graphql/PaginatedResponse'
import { BaseFilter } from '@app/graphql/filters/BaseFilter'
import { StringFilterOperator } from '@app/graphql/filters/StringFilterOperator'
import {
  ArgsType,
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { Brand } from '../entities/brand.entity'

@InputType()
export class BrandCreateInput {
  @Field()
  name: string
}

@ObjectType()
export class BrandCreateResponse extends DefaultMutationResponse {
  @Field(() => Brand, { nullable: true })
  record?: Brand
}

@InputType()
export class BrandUpdateInput {
  @Field({ nullable: true })
  name?: string
}

@ObjectType()
export class BrandUpdateResponse extends DefaultMutationResponse {
  @Field(() => Brand, { nullable: true })
  record?: Brand
}

export enum BrandSort {
  NAME_ASC = 'name_ASC',
  NAME_DESC = 'name_DESC',
  ID_ASC = 'id_ASC',
  ID_DESC = 'id_DESC'
}

registerEnumType(BrandSort, {
  name: 'BrandSort'
})

@InputType()
export class BrandFilter extends BaseFilter {
  @Field({ nullable: true })
  @Type(() => StringFilterOperator)
  name?: StringFilterOperator
}

@ArgsType()
export class BrandPaginateArgs {
  @Field(() => Int, { defaultValue: 12 })
  perPage: number = 12

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1

  @Field(() => [BrandSort], { nullable: true })
  sort?: BrandSort[]

  @Field(() => BrandFilter, { nullable: true })
  @Type(() => BrandFilter)
  filter?: BrandFilter
}

@ObjectType()
export class BrandPaginateResponse extends PaginatedResponse {
  @Field(() => [Brand])
  items: Brand[]
}
