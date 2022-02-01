import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const contextType = context.getType<'graphql' | 'http'>()
    if (contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context)
      return ctx.getContext().req.user
    }
    if (contextType === 'http') {
      return context.getArgByIndex(0).user
    }
  }
)
