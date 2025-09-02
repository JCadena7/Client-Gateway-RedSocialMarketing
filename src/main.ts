import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

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

  // ✅ Configuración de OpenAPI
  const config = new DocumentBuilder()
    .setTitle('RBAC Gateway API')
    .setDescription('API Gateway para sistema de autenticación, roles y permisos dinámico')
    .setVersion('1.0.0')
    .addTag('auth', 'Endpoints de autenticación y login')
    .addTag('rbac', 'Gestión de roles y permisos')
    .addTag('users', 'Gestión de usuarios y asignaciones')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido del login'
      },
      'JWT-auth',
    )
    .addServer(`http://localhost:${envs.port}`, 'Desarrollo')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ Configurar Scalar usando middleware oficial
  app.use('/api/v1/docs-json', (req, res) => {
    res.type('application/json').send(document);
  });

  app.use(
    '/api/v1/docs',
    apiReference({
      theme: 'purple',
      content: document,
    }),
  );

  await app.listen(envs.port, () => {
    logger.log(`🚀 Gateway running on port ${envs.port}`);
    logger.log(`📚 Scalar Docs: http://localhost:${envs.port}/api/v1/docs`);
    logger.log(`📄 OpenAPI JSON: http://localhost:${envs.port}/api/v1/docs-json`);
  });
}
bootstrap();