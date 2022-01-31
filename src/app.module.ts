import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'

import { configService } from './config/config.service'
import { UserModule } from './user/user.module'
import { VehicleModule } from './vehicle/vehicle.module'
import { ReportModule } from './report/report.module'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'

@Module({
  imports: [
    AuthModule,
    UserModule,
    FileModule,
    VehicleModule,
    ReportModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GraphQLModule.forRoot(configService.getGqlConfig())
  ]
})
export class AppModule {}
