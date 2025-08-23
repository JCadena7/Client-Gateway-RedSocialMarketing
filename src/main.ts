import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ExceptionFilter } from './common/exceptions';

import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('ClientGatewayBoostrap');

  const app = await NestFactory.create(AppModule);

  await app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new ExceptionFilter());

  await app.listen(envs.port, () => {
    logger.log(`🚀 Gateway running on port ${envs.port}`);
  });
}
bootstrap();