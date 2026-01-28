import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import { APP_CONFIG, AppConfig } from './app-config/app-config.constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Content Settings zentral aus AppConfigModule
  const appConfig = app.get<AppConfig>(APP_CONFIG);

  const baseURL = appConfig.baseURL;
  const docsEndpoint = appConfig.docsEndpoint;
  const port = appConfig.port;
  const staticPath = appConfig.staticDir;
  const staticEndpoint = appConfig.staticEndpoint;
  const angularURL = appConfig.angularURL;

  if (!fs.existsSync(staticPath)) {
    throw new Error(`CONTENT_DIR existiert nicht: ${staticPath}`);
  } else if (!fs.statSync(staticPath).isDirectory()) {
    throw new Error(`CONTENT_DIR ist kein Verzeichnis: ${staticPath}`);
  }

  app.useStaticAssets(staticPath, { prefix: staticEndpoint });

  // CORS
  app.enableCors({
    origin: angularURL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Artificial or Natural Intelligence API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(docsEndpoint, app, document);

  await app.listen(port);

  console.log(`Server läuft auf ${baseURL}:${port}`);
  console.log(`Swagger UI läuft auf ${baseURL}:${port}${docsEndpoint}`);
  console.log(`Speicherort der Inhalte: ${staticPath}`);
  console.log(`Static Endpoint: ${staticEndpoint}`);
}
bootstrap();