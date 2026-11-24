import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FileModule } from '@app/file/file.module'
import { File } from '@app/file/file.entity'
import { Report } from '@app/report/entities/report.entity'
import { ReportModule } from '@app/report/report.module'
import { Result } from '@app/result/entities/result.entity'

import { RecoveryController } from './recovery.controller'
import { RecoveryService } from './recovery.service'

@Module({
  imports: [
    FileModule,
    ReportModule,
    TypeOrmModule.forFeature([File, Report, Result])
  ],
  controllers: [RecoveryController],
  providers: [RecoveryService]
})
export class RecoveryModule {}
