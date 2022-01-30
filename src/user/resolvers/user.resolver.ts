import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { Action, CaslAbilityFactory } from '@app/casl/casl-ability.factory'

import { UserService } from '../services/user.service'
import { User } from '../entities/user.entity'
import * as objects from '../user.objects'
import { CurrentUser } from '@app/auth/CurrentUser'

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Query(() => User, { nullable: true })
  async user(
    @Args('id', { type: () => Int }) id: number
  ): Promise<User | undefined> {
    return this.userService.findById(id)
  }

  @Query(() => User, { nullable: true })
  async currentUser(
    @CurrentUser() currentUser: User
  ): Promise<User | undefined> {
    if (currentUser) {
      await this.userService.updateLastActivity(currentUser)
    }
    return currentUser
  }

  @Query(() => objects.UserPaginateResponse)
  async userPaginate(
    @Args() args: objects.UserPaginateArgs
  ): Promise<objects.UserPaginateResponse> {
    return this.userService.paginate(args)
  }

  @Mutation(() => objects.UserCreateResponse)
  async userCreate(
    @CurrentUser() currentUser: User,
    @Args('input') input: objects.UserCreateInput
  ): Promise<objects.UserCreateResponse> {
    const ability = this.caslAbilityFactory.createForUser(currentUser)
    if (ability.can(Action.Read, 'all')) {
      // "user" has read access to everything
    }

    const result = await this.userService.create(input)

    return result.match<objects.UserCreateResponse>(
      (record) => ({
        record,
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }

  @Mutation(() => objects.UserUpdateResponse)
  async userUpdate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: objects.UserUpdateInput
  ): Promise<objects.UserUpdateResponse> {
    const result = await this.userService.update(id, input)

    return result.match<objects.UserUpdateResponse>(
      (record) => ({
        record,
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }

  @Mutation(() => objects.UserDeleteResponse)
  async userDelete(
    @Args('id', { type: () => Int }) id: number
  ): Promise<objects.UserDeleteResponse> {
    const result = await this.userService.delete(id)

    return result.match<objects.UserDeleteResponse>(
      () => ({
        success: true
      }),
      (error) => ({
        error,
        success: false
      })
    )
  }
}
