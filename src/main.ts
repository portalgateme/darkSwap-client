import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { DarkSwapExceptionFilter } from './common/exception.filter';
import { ResponseInterceptor } from './common/response.interceptor';
import { ConfigLoader } from './utils/configUtil';
import { CommonModule } from './common/common.module';


async function bootstrap() {
  ConfigLoader.getInstance();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new DarkSwapExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('API doc')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
}


bootstrap();