import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../app-config/app-config.module';
import { APP_CONFIG, AppConfig } from '../app-config/app-config.constants';
import { Content } from './entities/content.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [
    AppConfigModule,
    MulterModule.registerAsync({
      imports: [AppConfigModule],
      inject: [APP_CONFIG],
      useFactory: (appConfig: AppConfig) => ({
        storage: diskStorage({
          destination: appConfig.staticDir,
          filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname)}`),
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
      }),
    }),
    TypeOrmModule.forFeature([Content]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}