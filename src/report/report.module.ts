import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@app/user/user.module'
import { VehicleModule } from '@app/vehicle/vehicle.module'
import { LubricantModule } from '@app/lubricant/lubricant.module'
import { FileModule } from '@app/file/file.module'

import { Report } from './entities/report.entity'
import { ReportResolver } from './resolvers/report.resolver'
import { ReportService } from './services/report.service'
import { ReportController } from './controllers/report.controller'

@Module({
  imports: [
    UserModule,
    VehicleModule,
    LubricantModule,
    FileModule,
    TypeOrmModule.forFeature([Report])
  ],
  controllers: [ReportController],
  providers: [ReportService, ReportResolver],
  exports: [ReportService, ReportResolver]
})
export class ReportModule {}
