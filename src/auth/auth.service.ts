import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor (
    private readonly jwtService: JwtService
  ) {}

  async encodeAuthToken (id: string): Promise<ReturnType<JwtService['sign']>> {
    return this.jwtService.sign({ id })
  }
}
