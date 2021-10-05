import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ContextModule } from '@app/context/context.module'
import { UserModule } from '@app/user/user.module'
import { VehicleModule } from '@app/vehicle/vehicle.module'
import { FileModule } from '@app/file/file.module'

import {
  Report
} from './entities/report.entity'
import { ReportResolver } from './resolvers/report.resolver'
import { ReportService } from './services/report.service'
import { ReportController } from './controllers/report.controller'

@Module({
  controllers: [ReportController],
  imports: [
    ContextModule,
    UserModule,
    VehicleModule,
    FileModule,
    TypeOrmModule.forFeature([Report])
  ],
  providers: [
    ReportService,
    ReportResolver
  ],
  exports: [
    ReportService,
    ReportResolver
  ]
})
export class ReportModule {}
