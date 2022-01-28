import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { UserService } from '@app/user/services/user.service'

import { GqlAuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import * as errors from './auth.errors'
import * as objects from './auth.objects'

@Resolver()
@UseGuards(GqlAuthGuard)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => objects.SignInResponse)
  async signIn(
    @Args('input') input: objects.SignInInput
  ): Promise<objects.SignInResponse> {
    const user = await this.userService.findByEmail(input.email)

    if (!user) {
      return {
        error: new errors.AuthValidationError(
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
        error: new errors.AuthValidationError('password', 'Неверный пароль!'),
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
