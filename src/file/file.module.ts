import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FileService } from './file.service'
import { FileResolver } from './file.resolver'
import { File } from './file.entity'
import { FileController } from './file.controller'

@Module({
  controllers: [FileController],
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileService, FileResolver],
  exports: [FileService]
})
export class FileModule {}
