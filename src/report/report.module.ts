import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@app/user/user.module'
import { VehicleModule } from '@app/vehicle/vehicle.module'
import { FileModule } from '@app/file/file.module'

import { Report } from './entities/report.entity'
import { ReportResolver } from './resolvers/report.resolver'
import { ReportService } from './services/report.service'

@Module({
  imports: [
    UserModule,
    VehicleModule,
    FileModule,
    TypeOrmModule.forFeature([Report])
  ],
  providers: [ReportService, ReportResolver],
  exports: [ReportService, ReportResolver]
})
export class ReportModule {}
