import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { UserService } from '@app/user/services/user.service'
import { ValidationError } from '@app/graphql/errors/ValidationError'

import { SignInInput, SignInResponse } from './auth.dto'
import { GqlAuthGuard } from './auth.guard'
import { AuthService } from './auth.service'

@Resolver()
@UseGuards(GqlAuthGuard)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => SignInResponse)
  async signIn(@Args('input') input: SignInInput): Promise<SignInResponse> {
    const user = await this.userService.findByEmail(input.email)

    if (!user) {
      return {
        error: new ValidationError(
          'email',
          'Пользователя с таким e-mail не существует!'
        ),
        success: false
      }
    }

    if (
      !(await this.userService.checkPasswordHash(input.password, user.password))
    ) {
      return {
        error: new ValidationError('password', 'Неверный пароль!'),
        success: false
      }
    }

    return {
      token: await this.authService.encodeAuthToken(user.id),
      record: user,
      success: true
    }
  }
}
