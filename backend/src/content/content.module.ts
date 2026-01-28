import { BadRequestException, Module } from '@nestjs/common';
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
        fileFilter: (req, file, cb) => {
          const allowedImageExtensions = /\.(png|jpe?g|gif|svg|webp|tiff|bmp)$/i.test(file.originalname);
          const allowedAudioExtensions = /\.(mp3|aac|ogg|flac|alac|wav|aiff)$/i.test(file.originalname);
          const allowedVideoExtensions = /\.(mp4|mkv|mov|avi|wmv|webm)$/i.test(file.originalname);
          const allowedTextExtensions = /\.(txt|csv)$/i.test(file.originalname);

          if (!allowedImageExtensions && !allowedAudioExtensions && !allowedVideoExtensions && !allowedTextExtensions) {
            return cb(new BadRequestException('Nur Bilder, Videos, Audio oder Textdateien erlaubt!'), false);
          }
          cb(null, true);
        },
        limits: { fileSize: 20 * 1024 * 1024 * 1024 },
      }),
    }),
    TypeOrmModule.forFeature([Content]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}