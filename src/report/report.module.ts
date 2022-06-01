import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@app/user/user.module'
import { VehicleModule } from '@app/vehicle/vehicle.module'
import { FileModule } from '@app/file/file.module'

import { Report } from './entities/report.entity'
import { ReportApplicationForm } from './entities/reportApplicationForm.entity'
import { ReportResolver } from './resolvers/report.resolver'
import { ReportService } from './services/report.service'
import { ReportController } from './controllers/report.controller'

@Module({
  imports: [
    UserModule,
    VehicleModule,
    FileModule,
    TypeOrmModule.forFeature([Report, ReportApplicationForm])
  ],
  controllers: [ReportController],
  providers: [ReportService, ReportResolver],
  exports: [ReportService, ReportResolver]
})
export class ReportModule {}
