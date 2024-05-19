import { Brand } from '@app/brand/entities/brand.entity'
import { Lubricant } from '@app/lubricant/entities/lubricant.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MigrateController } from './migrate.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Lubricant])],
  providers: [],
  exports: [],
  controllers: [MigrateController]
})
export class MigrateModule {}
