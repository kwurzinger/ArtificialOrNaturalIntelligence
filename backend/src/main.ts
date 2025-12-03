import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '../static'), {
    prefix: '/static',
  });

  // Swagger-Konfiguration
  const config = new DocumentBuilder()
    .setTitle('Artificial or Natural Intelligence API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI unter /docs
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log(`Server läuft auf http://localhost:3000`);
  console.log(`Swagger UI läuft auf http://localhost:3000/docs`);
}
bootstrap();