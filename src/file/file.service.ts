import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { S3 } from 'aws-sdk'
import { fromBuffer } from 'file-type'
// import https from 'https'
import * as stream from 'node:stream'
const https = require('https')

import { configService } from '@app/config/config.service'

import { File } from './file.entity'
import { User } from '@app/user/entities/user.entity'

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>
  ) {}

  createQueryBuilder(): SelectQueryBuilder<File> {
    return this.fileRepository.createQueryBuilder('file')
  }

  async findById(id: number): Promise<File | null> {
    return await this.fileRepository.findOneBy({ id })
  }

  async findByIdOrFail(id: number): Promise<File> {
    return await this.fileRepository.findOneByOrFail({ id })
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
    fileEntity.user = Promise.resolve(command.user || null)
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
    const type = await fromBuffer(command.buffer)

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
  async getStream(file: File): Promise<stream.Readable> {
    const url = await this.getUrl(file)
    return new Promise((resolve, reject) => {
      https
        .get(url)
        .addListener('response', (response) => {
          resolve(response)
        })
        .addListener('error', (error) => {
          reject(error)
        })
    })
  }
}
