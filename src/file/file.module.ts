import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ContextModule } from '@app/context/context.module'

import { FileService } from './file.service'
import { FileResolver } from './file.resolver'
import { File } from './file.entity'
import { FileController } from './file.controller'

@Module({
  controllers: [FileController],
  imports: [
    ContextModule,
    TypeOrmModule.forFeature([File])
  ],
  providers: [FileService, FileResolver],
  exports: [FileService]
})
export class FileModule {}
