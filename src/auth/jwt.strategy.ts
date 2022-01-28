import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { configService } from '@app/config/config.service'
import { User } from '@app/user/entities/user.entity'
import { UserService } from '@app/user/services/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getSecret()
    })
  }

  async validate(payload: any): Promise<User | undefined> {
    try {
      return await this.userService.findById(payload.id)
    } catch {
      return undefined
    }
  }
}
