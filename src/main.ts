import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'path';
import fs from 'fs';

async function app() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const outputPath = path.resolve(process.cwd(), 'swagger.json');
  await fs.promises.writeFile(outputPath, JSON.stringify(document), {
    encoding: 'utf8',
  });

  await app.listen(3000);
}

app();
