import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async encodeAuthToken(id: number): Promise<ReturnType<JwtService['sign']>> {
    return this.jwtService.sign({ id })
  }
}
