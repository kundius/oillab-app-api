import { ObjectType } from '@nestjs/graphql'

import { NotFoundError } from '@app/core/errors/NotFoundError'
import { NotAllowedError } from '@app/core/errors/NotAllowedError'

@ObjectType({ implements: NotFoundError })
export class ReportNotFoundError extends NotFoundError {
  constructor(reportId: number) {
    super(`Report id = ${reportId} not found!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class ReportUpdateNotAllowedError extends NotAllowedError {
  constructor(reportId: number) {
    super(`Report id = ${reportId} update not allowed!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class ReportDeleteNotAllowedError extends NotAllowedError {
  constructor(reportId: number) {
    super(`Report id = ${reportId} delete not allowed!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class ReportCreateNotAllowedError extends NotAllowedError {
  constructor() {
    super(`Report create not allowed!`)
  }
}

@ObjectType({ implements: NotAllowedError })
export class ReportGeneratePdfNotAllowedError extends NotAllowedError {
  constructor() {
    super(`Generate pdf not allowed!`)
  }
}
