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
        BASE_URL: Joi.string().optional(),
        API_PORT: Joi.number().optional(),
        CONTENT_DIR: Joi.string().optional(),
        CONTENT_ENDPOINT: Joi.string().optional(),
        DOCS_ENDPOINT: Joi.string().optional(),
        PG_HOST: Joi.string().required(),
        PG_PORT: Joi.number().required(),
        PG_USERNAME: Joi.string().required(),
        PG_PASSWORD: Joi.string().required(),
        PG_DBNAME: Joi.string().required(),
        ADMIN_DEFAULT_USERNAME: Joi.string().required(),
        ADMIN_DEFAULT_PASSWORD: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().optional(),
        ANGULAR_URL: Joi.string().optional()
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
        const pgHost = appConfig.get<string>('PG_HOST');
        const pgPort = appConfig.get<number>('PG_PORT');
        const pgUsername = appConfig.get<string>('PG_USERNAME');
        const pgPassword = appConfig.get<string>('PG_PASSWORD');
        const pgDbname = appConfig.get<string>('PG_DBNAME');
        const adminDefaultUsername = appConfig.get<string>('ADMIN_DEFAULT_USERNAME');
        const adminDefaultPassword = appConfig.get<string>('ADMIN_DEFAULT_PASSWORD');
        const jwtSecret = appConfig.get<string>('JWT_SECRET');
        const jwtExpiresIn = appConfig.get<string>('JWT_EXPIRES_IN') ?? '1h';
        const angularURL = appConfig.get<string>('ANGULAR_URL') ?? 'http://localhost:4200';

        return {
          baseURL, port, staticDir, staticEndpoint, docsEndpoint, 
          pgHost, pgPort, pgUsername, pgPassword, pgDbname,
          adminDefaultUsername, adminDefaultPassword, jwtSecret, jwtExpiresIn, angularURL
        };
      },
    },
  ],
  exports: [NestConfigModule, APP_CONFIG],
})
export class AppConfigModule {}