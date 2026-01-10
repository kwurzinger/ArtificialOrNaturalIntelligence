import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { existsSync, mkdirSync } from 'fs';
import { isAbsolute, join } from 'path';
import { APP_CONFIG, AppConfig } from './app-config.constants';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PG_HOST: Joi.string().required(),
        PG_PORT: Joi.number().required(),
        PG_USERNAME: Joi.string().required(),
        PG_PASSWORD: Joi.string().required(),
        PG_DBNAME: Joi.string().required(),
        BASE_URL: Joi.string().optional(),
        API_PORT: Joi.number().optional(),
        CONTENT_DIR: Joi.string().optional(),
        CONTENT_ENDPOINT: Joi.string().optional(),
        DOCS_ENDPOINT: Joi.string().optional(),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_CONFIG,
      inject: [ConfigService],
      useFactory: (appConfig: ConfigService): AppConfig => {
        const dirFromEnv = appConfig.get<string>('CONTENT_DIR') ?? 'static';
        const staticDir = isAbsolute(dirFromEnv) ? dirFromEnv : join(process.cwd(), dirFromEnv);

        if (!existsSync(staticDir)) mkdirSync(staticDir, { recursive: true });

        const baseURL = appConfig.get<string>('BASE_URL') ?? 'http://localhost';
        const port = appConfig.get<number>('API_PORT') ?? 3000;
        const staticEndpoint = appConfig.get<string>('CONTENT_ENDPOINT') ?? '/static';
        const docsEndpoint = appConfig.get<string>('DOCS_ENDPOINT') ?? '/api-docs';

        return { baseURL, port, staticDir, staticEndpoint, docsEndpoint };
      },
    },
  ],
  exports: [NestConfigModule, APP_CONFIG],
})
export class AppConfigModule {}