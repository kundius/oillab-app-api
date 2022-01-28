import { ObjectType } from '@nestjs/graphql'

import { NotFoundError } from '@app/core/errors/NotFoundError'
import { NotAllowedError } from '@app/core/errors/NotAllowedError'

@ObjectType({ implements: NotFoundError })
export class UserNotFoundError extends NotFoundError {
  constructor(userId: number) {
    super(`User id = ${userId} not found!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class UserUpdateNotAllowedError extends NotAllowedError {
  constructor(userId: number) {
    super(`User id = ${userId} update not allowed!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class UserDeleteNotAllowedError extends NotAllowedError {
  constructor(userId: number) {
    super(`User id = ${userId} delete not allowed!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class UserCreateNotAllowedError extends NotAllowedError {
  constructor() {
    super(`User create not allowed!`)
  }
}
