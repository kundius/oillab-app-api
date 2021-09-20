import { Injectable, Scope, Inject } from '@nestjs/common'
import { User } from '@app/user/entities/user.entity'

interface Request {
  user?: User
}

interface GqlContext {
  req: {
    user?: User
  }
}

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  constructor (
    @Inject('REQUEST')
    private readonly context: GqlContext | Request
  ) {}

  getCurrentUser (): User | undefined {
    const user = 'req' in this.context ? this.context?.req?.user : this.context?.user
    return user || undefined
  }
}
