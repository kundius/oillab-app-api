import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { GqlModuleOptions } from '@nestjs/graphql'
import { join } from 'path'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { S3 } from 'aws-sdk'
import { config } from 'dotenv'

config()

class ConfigService {
  constructor (private readonly env: { [k: string]: string | undefined }) { }

  public ensureValues (keys: string[]): ConfigService {
    keys.forEach(k => this.getValue(k, true))
    return this
  }

  public getOrigin (): string {
    return this.getValue('APP_ORIGIN', true)
  }

  public getPort (): string {
    return this.getValue('APP_PORT', true)
  }

  public getSecret (): string {
    return this.getValue('APP_SECRET', true)
  }

  public isProduction (): boolean {
    const APP_MODE = this.getValue('APP_MODE', false)
    return APP_MODE !== 'development'
  }

  public getTypeOrmConfig (): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getValue('TYPEORM_HOST'),
      port: parseInt(this.getValue('TYPEORM_PORT'), 2),
      username: this.getValue('TYPEORM_USERNAME'),
      password: this.getValue('TYPEORM_PASSWORD'),
      database: this.getValue('TYPEORM_DATABASE'),
      entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')], // Workaround https://stackoverflow.com/a/59607836
      migrationsTableName: 'migration',
      cli: {
        migrationsDir: 'migration'
      },
      synchronize: false,
      ssl: false
    }
  }

  public getGqlConfig (): GqlModuleOptions {
    return {
      // debug: true,
      // playground: true,
      introspection: true,
      debug: !this.isProduction(),
      playground: !this.isProduction(),
      // installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'schema.gql')
    }
  }

  public getCorsConfig (): CorsOptions {
    return {
      origin: this.getValue('APP_ORIGIN').split(',')
    }
  }

  public getS3ClientConfig (): S3.Types.ClientConfiguration {
    return {
      accessKeyId: this.getValue('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.getValue('S3_SECRET_ACCESS_KEY'),
      endpoint: this.getValue('S3_ENDPOINT'),
      s3ForcePathStyle: true,
      region: this.getValue('S3_REGION'),
      apiVersion: 'latest'
    }
  }

  public getS3Bucket (): string {
    return this.getValue('S3_BUCKET')
  }

  public getS3Url (): string {
    return this.getValue('S3_URL')
  }

  private getValue (key: string, throwOnMissing = true): string {
    const value = this.env[key]

    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`)
    }

    return value as string
  }
}

const configService = new ConfigService(process.env)
  .ensureValues([
    'APP_MODE',
    'APP_SECRET',
    'APP_ORIGIN',
    'APP_PORT',
    'TYPEORM_HOST',
    'TYPEORM_PORT',
    'TYPEORM_USERNAME',
    'TYPEORM_PASSWORD',
    'TYPEORM_DATABASE',
    'S3_ENDPOINT',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'S3_REGION',
    'S3_BUCKET',
    'S3_URL'
  ])

export { configService }
