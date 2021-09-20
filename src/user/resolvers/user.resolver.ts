import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { ContextService } from '@app/context/context.service'
import { NotFoundError } from '@app/graphql/NotFoundError'

import { UserService } from '../services/user.service'
import { User } from '../entities/user.entity'
import * as dto from '../dto/user.dto'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor (
    private readonly userService: UserService,
    private readonly contextService: ContextService
  ) {}

  @Query(() => User, { nullable: true })
  async user (
    @Args('id', { type: () => String }) id: string
  ): Promise<User | undefined> {
    return this.userService.findById(id)
  }

  @Query(() => User, { nullable: true })
  async currentUser (): Promise<User | undefined> {
    const currentUser = this.contextService.getCurrentUser()
    if (currentUser) {
      await this.userService.updateLastActivity(currentUser)
    }
    return currentUser
  }

  @Query(() => dto.UserPaginateResponse)
  async userPaginate (
    @Args() args: dto.UserPaginateArgs
  ): Promise<dto.UserPaginateResponse> {
    return this.userService.paginate(args)
  }

  @Mutation(() => dto.UserCreateResponse)
  async userCreate (
    @Args('input') input: dto.UserCreateInput
  ): Promise<dto.UserCreateResponse> {
    const record = await this.userService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.UserUpdateResponse)
  async userUpdate (
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: dto.UserUpdateInput
  ): Promise<dto.UserUpdateResponse> {
    const record = await this.userService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    await this.userService.update(record, input)

    return {
      record,
      success: true
    }
  }

  
  @Mutation(() => DefaultMutationResponse)
  async userDelete (
    @Args('id') id: string
  ): Promise<DefaultMutationResponse> {
    const record = await this.userService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    await this.userService.delete(record)

    return {
      success: true
    }
  }
}
