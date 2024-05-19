import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Brand } from './entities/brand.entity'
import { BrandResolver } from './resolvers/brand.resolver'
import { BrandService } from './services/brand.service'

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandService, BrandResolver],
  exports: [BrandService, BrandResolver]
})
export class BrandModule {}
