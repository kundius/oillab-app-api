import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import path from 'path'

import { GqlAuthGuard } from '@app/auth/auth.guard'
import { configService } from '@app/config/config.service'

import { File } from './file.entity'
import { FileService } from './file.service'

@Resolver(() => File)
@UseGuards(GqlAuthGuard)
export class FileResolver {
  constructor (
    private readonly fileService: FileService
  ) {}

  @ResolveField(() => String, { nullable: true })
  async url (@Parent() file: File): Promise<string> {
    return this.fileService.getUrl(file)
  }

  @Query(() => File, { nullable: true })
  async file (
    @Args('id', { type: () => ID }) id: number
  ): Promise<File | undefined> {
    return this.fileService.findById(id)
  }
}
