import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './app-config/app-config.module';
import { APP_CONFIG, AppConfig } from './app-config/app-config.constants';
import { ContentModule } from './content/content.module';
import { Content } from './content/entities/content.entity';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/entities/admin.entity';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [APP_CONFIG],
      useFactory: (appConfig: AppConfig) => ({
        type: 'postgres',
        host: appConfig.pgHost,
        port: appConfig.pgPort,
        username: appConfig.pgUsername,
        password: appConfig.pgPassword,
        database: appConfig.pgDbname,
        entities: [Content, Admin],
        synchronize: true,
      }),
    }),
    AdminModule,
    ContentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}