import { ObjectType } from '@nestjs/graphql'

import { NotFoundError } from '@app/core/errors/NotFoundError'
import { NotAllowedError } from '@app/core/errors/NotAllowedError'

@ObjectType({ implements: NotFoundError })
export class VehicleNotFoundError extends NotFoundError {
  constructor(vehicleId: number) {
    super(`Vehicle id = ${vehicleId} not found!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class VehicleUpdateNotAllowedError extends NotAllowedError {
  constructor(vehicleId: number) {
    super(`Vehicle id = ${vehicleId} update not allowed!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class VehicleDeleteNotAllowedError extends NotAllowedError {
  constructor(vehicleId: number) {
    super(`Vehicle id = ${vehicleId} delete not allowed!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class VehicleCreateNotAllowedError extends NotAllowedError {
  constructor() {
    super(`Vehicle create not allowed!`)
  }
}
