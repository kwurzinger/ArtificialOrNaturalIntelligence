import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const staticPath = join(__dirname, configService.get<string>('CONTENT_DIR') ?? '../static');
  const staticEndpoint = configService.get<string>('CONTENT_ENDPOINT') ?? '/static';
  const docsEndpoint = configService.get<string>('DOCS_ENDPOINT') ?? '/api-docs';
  const port = parseInt(configService.get<string>('API_PORT') ?? '3000', 10);

  if (!fs.existsSync(staticPath)) {
    throw new Error(
      `Der Pfad in der CONTENT_DIR Variable existiert nicht: ${staticPath}`,
    );
  }
  else if (!fs.statSync(staticPath).isDirectory()) {
    throw new Error(
      `Der Pfad in der CONTENT_DIR Variable ist kein Verzeichnis: ${staticPath}`,
    );
  }

  app.useStaticAssets(staticPath, {
    prefix: staticEndpoint,
  });

  // Swagger-Konfiguration
  const config = new DocumentBuilder()
    .setTitle('Artificial or Natural Intelligence API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI unter /docs
  SwaggerModule.setup(docsEndpoint, app, document);

  await app.listen(port);
  console.log(`Server läuft auf http://localhost:${port}`);
  console.log(`Swagger UI läuft auf http://localhost:${port}${docsEndpoint}`);
  console.log("Speicherort der Inhalte: " + staticPath)
}
bootstrap();