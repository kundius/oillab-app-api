import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@app/user/user.module'

import { OilType } from './entities/oil-type.entity'
import { OilTypeResolver } from './resolvers/oil-type.resolver'
import { OilTypeService } from './services/oil-type.service'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([OilType])
  ],
  providers: [
    OilTypeService,
    OilTypeResolver
  ],
  exports: [
    OilTypeService,
    OilTypeResolver
  ]
})
export class OilTypeModule {}
