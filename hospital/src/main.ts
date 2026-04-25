import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

// ✅ Swagger imports
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  
  // ✅ Serve uploads folder
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // <--- Add this option
  });


  // ✅ Global configs
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Hospital API')
    .setDescription('Hospital Management Backend APIs')
    .setVersion('1.0')
    // .addBearerAuth() // for JWT later
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  // ✅ Port from env
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📄 Swagger running on http://localhost:${port}/api-docs`);
}
bootstrap();