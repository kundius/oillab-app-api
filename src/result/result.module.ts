import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@app/user/user.module'
import { ReportModule } from '@app/report/report.module'
import { FileModule } from '@app/file/file.module'

import { Result } from './entities/result.entity'
import { ResultResolver } from './resolvers/result.resolver'
import { ResultService } from './services/result.service'
import { ResultIndicator } from './entities/result-indicator.entity'

@Module({
  imports: [
    UserModule,
    ReportModule,
    TypeOrmModule.forFeature([Result, ResultIndicator])
  ],
  providers: [ResultService, ResultResolver],
  exports: [ResultService, ResultResolver]
})
export class ResultModule {}
