import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@app/user/user.module'

import { Lubricant } from './entities/lubricant.entity'
import { LubricantResolver } from './resolvers/lubricant.resolver'
import { LubricantService } from './services/lubricant.service'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Lubricant])
  ],
  providers: [
    LubricantService,
    LubricantResolver
  ],
  exports: [
    LubricantService,
    LubricantResolver
  ]
})
export class LubricantModule {}
