// import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configService } from './config/config.service'
// import { graphqlUploadExpress } from 'graphql-upload'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)
  // app.useGlobalPipes(new ValidationPipe({
  //   transform: true
  // }))
  // app.use(graphqlUploadExpress())
  app.enableCors(configService.getCorsConfig())

  await app.listen(configService.getPort())

  console.log(`Application is running on: ${await app.getUrl()}`)
}
// eslint-disable-next-line no-void
void bootstrap()
