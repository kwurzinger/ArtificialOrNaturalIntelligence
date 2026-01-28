import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtStrategy } from './jwt.strategy';
import type { StringValue } from 'ms';
import { AppConfigModule } from '../app-config/app-config.module';
import { APP_CONFIG, AppConfig } from '../app-config/app-config.constants';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([Admin]),
    PassportModule,
    JwtModule.registerAsync({
        imports: [AppConfigModule],
        inject: [APP_CONFIG],
        useFactory: (appConfig: AppConfig) => ({
            secret: appConfig.jwtSecret,
            signOptions: {
              expiresIn: (appConfig.jwtExpiresIn) as StringValue,
            },
        }),
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
})
export class AdminModule {}