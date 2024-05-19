import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { configService } from './config/config.service'
import { FileModule } from './file/file.module'
import { LubricantModule } from './lubricant/lubricant.module'
import { OilTypeModule } from './oil-type/oil-type.module'
import { ReportModule } from './report/report.module'
import { ResultModule } from './result/result.module'
import { UserModule } from './user/user.module'
import { VehicleModule } from './vehicle/vehicle.module'
import { BrandModule } from './brand/brand.module'
import { MigrateModule } from './migrate/migrate.module'

@Module({
  imports: [
    MigrateModule,
    AuthModule,
    UserModule,
    FileModule,
    VehicleModule,
    ReportModule,
    LubricantModule,
    BrandModule,
    ResultModule,
    OilTypeModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GraphQLModule.forRoot(configService.getGraphQLConfig())
  ]
})
export class AppModule {}
