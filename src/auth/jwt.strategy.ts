import { configService } from '@app/config/config.service'
import { User } from '@app/user/entities/user.entity'
import { UserService } from '@app/user/services/user.service'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token')
      ]),
      secretOrKey: configService.getSecret()
    })
  }

  async validate(payload: any): Promise<User | null> {
    try {
      return await this.userService.findById(payload.id)
    } catch {
      return null
    }
  }
}
