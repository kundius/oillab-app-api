import { CurrentUser } from '@app/auth/CurrentUser'
import { User, UserRole } from '@app/user/entities/user.entity'
import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { RecoveryService } from './recovery.service'

@Controller('recovery')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  private assertAdministrator(currentUser?: User): void {
    if (!currentUser) {
      throw new UnauthorizedException()
    }

    if (currentUser.role !== UserRole.Administrator) {
      throw new ForbiddenException()
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('status')
  status(@CurrentUser() currentUser?: User) {
    this.assertAdministrator(currentUser)

    return this.recoveryService.getStatus()
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('start')
  start(
    @Query('dryRun') dryRun?: string,
    @CurrentUser() currentUser?: User
  ) {
    this.assertAdministrator(currentUser)

    return this.recoveryService.start(dryRun === 'true')
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('stop')
  stop(@CurrentUser() currentUser?: User) {
    this.assertAdministrator(currentUser)

    return this.recoveryService.stop()
  }
}
