import {
  Controller,
  ForbiddenException,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'

import { FileService } from '@app/file/file.service'
import { nanoid } from '@app/utils/nanoid'
import { CurrentUser } from '@app/auth/CurrentUser'
import { User } from '@app/user/entities/user.entity'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser?: User
  ) {
    if (!currentUser) {
      throw new ForbiddenException()
    }

    const fileEntity = await this.fileService.uploadAndCreateFile({
      buffer: file.buffer,
      dir: `user/${currentUser.id}/upload`,
      name: `${nanoid()}_${file.originalname}`,
      user: currentUser
    })

    return {
      success: 1,
      file: {
        url: await this.fileService.getUrl(fileEntity),
        id: fileEntity.id,
        name: fileEntity.name
      }
    }
  }
}
