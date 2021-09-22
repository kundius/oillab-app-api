import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { configService } from '@app/config/config.service'
import { UserModule } from '@app/user/user.module'
import { ContextModule } from '@app/context/context.module'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { GqlAuthGuard } from './auth.guard'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    UserModule,
    ContextModule,
    PassportModule,
    JwtModule.register({ secret: configService.getSecret() })
  ],
  providers: [AuthService, GqlAuthGuard, JwtStrategy, AuthResolver],
  exports: [AuthService, AuthResolver]
})
export class AuthModule {}
