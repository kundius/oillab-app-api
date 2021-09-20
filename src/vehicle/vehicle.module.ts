import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ContextModule } from '@app/context/context.module'
import { UserModule } from '@app/user/user.module'

import { Vehicle } from './entities/vehicle.entity'
import { VehicleResolver } from './resolvers/vehicle.resolver'
import { VehicleService } from './services/vehicle.service'

@Module({
  imports: [
    ContextModule,
    UserModule,
    TypeOrmModule.forFeature([Vehicle])
  ],
  providers: [
    VehicleService,
    VehicleResolver
  ],
  exports: [
    VehicleService,
    VehicleResolver
  ]
})
export class VehicleModule {}
