import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { NotFoundError } from '@app/graphql/errors/NotFoundError'
import { DefaultMutationResponse } from '@app/graphql/DefaultMutationResponse'
import { CurrentUser } from '@app/auth/CurrentUser'
import { AuthenticationError } from '@app/graphql/errors/AuthenticationError'
import { NotAllowedError } from '@app/graphql/errors/NotAllowedError'
import { ValidationError } from '@app/graphql/errors/ValidationError'

import { UserService } from '../services/user.service'
import { User, UserRole } from '../entities/user.entity'
import * as dto from '../dto/user.dto'

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { nullable: true })
  async user(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<User | null> {
    if (!currentUser) {
      return null
    }

    return this.userService.findById(id)
  }

  @Query(() => User, { nullable: true })
  async currentUser(
    @CurrentUser() currentUser?: User
  ): Promise<User | undefined> {
    if (currentUser) {
      await this.userService.updateLastActivity(currentUser)
    }
    return currentUser instanceof User ? currentUser : undefined
  }

  @Query(() => dto.UserPaginateResponse)
  async userPaginate(
    @Args() args: dto.UserPaginateArgs,
    @CurrentUser() currentUser?: User
  ): Promise<dto.UserPaginateResponse> {
    if (!currentUser) {
      return {
        items: [],
        pageInfo: {
          total: 0,
          page: args.page,
          perPage: args.perPage
        }
      }
    }

    return this.userService.paginate(args)
  }

  @Mutation(() => dto.UserCreateResponse)
  async userCreate(
    @Args('input') input: dto.UserCreateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.UserCreateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    if (currentUser.role !== UserRole.Administrator) {
      return {
        error: new NotAllowedError(),
        success: false
      }
    }

    if (await this.userService.isEmailExists(input.email)) {
      return {
        error: new ValidationError('email', 'Указанный e-mail занят.'),
        success: false
      }
    }

    const record = await this.userService.create(input)

    return {
      record,
      success: true
    }
  }

  @Mutation(() => dto.UserUpdateResponse)
  async userUpdate(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: dto.UserUpdateInput,
    @CurrentUser() currentUser?: User
  ): Promise<dto.UserUpdateResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.userService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    if (currentUser.role !== UserRole.Administrator) {
      return {
        error: new NotAllowedError(),
        success: false
      }
    }

    if (typeof input.email !== 'undefined' && record.email !== input.email && await this.userService.isEmailExists(input.email)) {
      return {
        error: new ValidationError('email', 'Указанный e-mail занят.'),
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
  async userDelete(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser?: User
  ): Promise<DefaultMutationResponse> {
    if (!currentUser) {
      return {
        error: new AuthenticationError(),
        success: false
      }
    }

    const record = await this.userService.findById(id)

    if (!record) {
      return {
        error: new NotFoundError(),
        success: false
      }
    }

    if (currentUser.role !== UserRole.Administrator) {
      return {
        error: new NotAllowedError(),
        success: false
      }
    }

    await this.userService.delete(record)

    return {
      success: true
    }
  }
}
