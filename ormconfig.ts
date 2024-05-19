// import { DataSource } from "typeorm";
// import { config } from 'dotenv'
// import { join } from 'path'

// config()

// export const connectionSource = new DataSource({
//   migrationsTableName: 'migration',
//   type: 'mysql',
//   host: process.env['TYPEORM_HOST'],
//   port: Number(process.env['TYPEORM_PORT']),
//   username: process.env['TYPEORM_USERNAME'],
//   password: process.env['TYPEORM_PASSWORD'],
//   database: process.env['TYPEORM_DATABASE'],
//   logging: false,
//   synchronize: false,
//   name: 'default',
//   entities: ['src/**/**.entity{.ts,.js}'],
//   migrations: ['migration/*{.ts,.js}'],
// })

import { DataSource } from "typeorm";
import { config } from 'dotenv'
import { join } from 'path'
import { configService } from "@app/config/config.service";

config()

export const connectionSource = new DataSource(configService.getTypeOrmConfig())
