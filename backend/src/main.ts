import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger-Konfiguration
  const config = new DocumentBuilder()
    .setTitle('Hello World API')
    .setDescription('Eine kleine Demo-API für /hello')
    .setVersion('1.0.0')
    .addTag('hello') // optional Tag für deine Endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI unter /docs
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log(`Server läuft auf http://localhost:3000`);
  console.log(`Swagger UI läuft auf http://localhost:3000/docs`);
}
bootstrap();