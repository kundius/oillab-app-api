import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '@app/user/user.module'

import { OilType } from './entities/oil-type.entity'
import { OilTypeResolver } from './resolvers/oil-type.resolver'
import { OilTypeService } from './services/oil-type.service'
import { OilTypeIndicator } from './entities/oil-type-indicator.entity'
import { OilTypeIndicatorResolver } from './resolvers/oil-type-indicator.resolver'
import { OilTypeIndicatorService } from './services/oil-type-indicator.service'
import { OilTypeResearch } from './entities/oil-type-research.entity'
import { OilTypeResearchResolver } from './resolvers/oil-type-research.resolver'
import { OilTypeResearchService } from './services/oil-type-research.service'

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([OilType, OilTypeIndicator, OilTypeResearch])
  ],
  providers: [
    OilTypeService,
    OilTypeResolver,
    OilTypeIndicatorService,
    OilTypeIndicatorResolver,
    OilTypeResearchService,
    OilTypeResearchResolver
  ],
  exports: [
    OilTypeService,
    OilTypeResolver,
    OilTypeIndicatorService,
    OilTypeIndicatorResolver,
    OilTypeResearchService,
    OilTypeResearchResolver
  ]
})
export class OilTypeModule {}
