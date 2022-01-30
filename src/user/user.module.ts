import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ContextModule } from '@app/context/context.module'

import {
  User
} from './entities/user.entity'
import { UserResolver } from './resolvers/user.resolver'
import { UserService } from './services/user.service'

@Module({
  imports: [
    ContextModule,
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    UserService,
    UserResolver
  ],
  exports: [
    UserService,
    UserResolver
  ]
})
export class UserModule {}
