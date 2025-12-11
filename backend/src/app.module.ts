import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentModule } from './content/content.module';
import { Content } from './content/entities/content.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validationSchema: Joi.object({
        PG_HOST: Joi.string().required(),
        PG_PORT: Joi.number().required(),
        PG_USERNAME: Joi.string().required(),
        PG_PASSWORD: Joi.string().required(),
        PG_DBNAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('PG_HOST'),
        port: parseInt(config.get<string>('PG_PORT')),
        username: config.get<string>('PG_USERNAME'),
        password: config.get<string>('PG_PASSWORD'),
        database: config.get<string>('PG_DBNAME'),
        entities: [Content],
        synchronize: true,
      }),
    }),
    ContentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}