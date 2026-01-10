import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from './app-config/app-config.module';
import { ContentModule } from './content/content.module';
import { Content } from './content/entities/content.entity';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
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
})
export class AppModule {}