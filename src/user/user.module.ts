import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './entities/user.entity'
import { UserResolver } from './resolvers/user.resolver'
import { UserService } from './services/user.service'
import { Brand } from '@app/brand/entities/brand.entity'
import { BrandModule } from '@app/brand/brand.module'

@Module({
  imports: [BrandModule, TypeOrmModule.forFeature([User, Brand])],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver]
})
export class UserModule {}
