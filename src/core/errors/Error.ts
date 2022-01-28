import { Field, InterfaceType } from "@nestjs/graphql"

@InterfaceType({
  isAbstract: true
})
export abstract class Error {
  @Field()
  public readonly message: string

  @Field()
  abstract type: string

  public readonly inner?: any

  constructor(
    message: string,
    inner?: any
  ) {
    this.message = message
    this.inner = inner
  }

  toString(): string {
    // Здесь логика сериализации, работа со стек-трейсами, вложенными ошибками и проч...
    return this.type
  }
}
