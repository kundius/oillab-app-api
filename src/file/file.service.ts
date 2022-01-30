import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { S3 } from 'aws-sdk'
// import { fileTypeFromBuffer } from 'file-type/core'

import { configService } from '@app/config/config.service'
import { ContextService } from '@app/context/context.service'

import { File } from './file.entity'
import { User } from '@app/user/entities/user.entity'

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly contextService: ContextService
  ) {}

  createQueryBuilder(): SelectQueryBuilder<File> {
    return this.fileRepository.createQueryBuilder('file')
  }

  async findById(id: number): Promise<File | undefined> {
    return await this.fileRepository.findOne(id)
  }

  async findByIdOrFail(id: number): Promise<File> {
    return await this.fileRepository.findOneOrFail(id)
  }

  async many(): Promise<{
    items: File[]
  }> {
    const qb = this.fileRepository.createQueryBuilder('file')

    const items = await qb.getMany()

    return {
      items
    }
  }

  async changeName(file: File, name: string): Promise<File> {
    file.name = name
    await this.fileRepository.save(file)
    return file
  }

  async createFile(command: {
    name: string
    path: string
    url: string
    size: number
    type?: string | null
    user?: User
  }): Promise<File> {
    const fileEntity = this.fileRepository.create()
    fileEntity.name = command.name
    fileEntity.path = command.path
    fileEntity.url = command.url
    fileEntity.size = command.size
    fileEntity.type = command.type || null
    fileEntity.user = Promise.resolve(
      command.user || this.contextService.getCurrentUser() || null
    )
    await this.fileRepository.save(fileEntity)
    return fileEntity
  }

  async getUrl(file: File): Promise<string> {
    return `${configService.getS3Url()}/${file.path}`
  }

  async uploadAndCreateFile(command: {
    buffer: Buffer
    name: string
    dir: string
    user?: User
  }): Promise<File> {
    const storedFile = await this.upload(command)

    return await this.createFile({
      ...storedFile,
      user: command.user
    })
  }

  async removeFile(file: File): Promise<void> {
    const s3 = new S3(configService.getS3ClientConfig())

    await s3
      .deleteObject({
        Bucket: configService.getS3Bucket(),
        Key: file.path
      })
      .promise()

    await this.fileRepository.remove(file)
  }

  async delete(file: File): Promise<void> {
    const s3 = new S3(configService.getS3ClientConfig())

    await s3
      .deleteObject({
        Bucket: configService.getS3Bucket(),
        Key: file.path
      })
      .promise()

    await this.fileRepository.remove(file)
  }

  async upload(command: {
    buffer: Buffer
    name: string
    dir: string
  }): Promise<{
    name: string
    path: string
    url: string
    size: number
    type?: string | null
  }> {
    const { fileTypeFromBuffer } = await import('file-type')
    const type = await fileTypeFromBuffer(command.buffer)

    const s3 = new S3(configService.getS3ClientConfig())

    let name = command.name
    let Key = name
    if (command.dir) {
      Key = `${command.dir}/${Key}`
    }

    await s3
      .putObject({
        Bucket: configService.getS3Bucket(),
        Body: command.buffer,
        Key,
        ContentType: type?.mime
      })
      .promise()

    return {
      name: name,
      path: Key,
      url: Key,
      size: Buffer.byteLength(command.buffer),
      type: type?.mime
    }
  }
}
