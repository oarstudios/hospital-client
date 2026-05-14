import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import cookieParser from 'cookie-parser';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);


   app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  


  const configService = app.get(ConfigService);

  // ✅ Cookie parser — required for JWT cookie extraction
  app.use(cookieParser());

  // ✅ Serve uploads folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const uploadPath = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // ✅ Global configs
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Hospital API')
    .setDescription('Hospital Management Backend APIs with integrated authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ✅ Port from env
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
