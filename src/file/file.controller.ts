import { Controller, ForbiddenException, NotFoundException, Param, Post, UploadedFile, UseInterceptors, UseGuards, Get } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'

import { FileService } from '@app/file/file.service'
import { nanoid } from '@app/utils/nanoid'
import { ContextService } from '@app/context/context.service'

@Controller('file')
export class FileController {
  constructor (
    private readonly contextService: ContextService,
    private readonly fileService: FileService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile (
    @UploadedFile() file: Express.Multer.File
  ) {
    const currentUser = this.contextService.getCurrentUser()

    if (!currentUser) {
      throw new ForbiddenException()
    }

    const fileEntity = await this.fileService.uploadAndCreateFile({
      buffer: file.buffer,
      dir: `user/${currentUser.id}/upload`,
      name: `${nanoid()}_${file.originalname}`
    })

    return {
      success: 1,
      file: {
        url: await this.fileService.getUrl(fileEntity),
        id: fileEntity.id
      }
    }
  }
}
