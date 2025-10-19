import * as Joi from 'joi';
import 'dotenv/config';

interface EnvVars {
  PORT: number;
  CORS_ORIGIN: string;
  CATEGORIAS_MICROSERVICE_HOST: string;
  CATEGORIAS_MICROSERVICE_PORT: number;
  POST_MICROSERVICE_HOST: string;
  POST_MICROSERVICE_PORT: number;
  USER_MICROSERVICE_HOST: string;
  USER_MICROSERVICE_PORT: number;
  AUTH_MICROSERVICE_HOST: string;
  AUTH_MICROSERVICE_PORT: number;
  COMMENT_MICROSERVICE_HOST: string;
  COMMENT_MICROSERVICE_PORT: number;
}

const envSchema = Joi.object({
  PORT: Joi.number().required(),
  CORS_ORIGIN: Joi.string().default('http://localhost:4321'),
  CATEGORIAS_MICROSERVICE_HOST: Joi.string().required(),
  CATEGORIAS_MICROSERVICE_PORT: Joi.number().required(),
  POST_MICROSERVICE_HOST: Joi.string().required(),
  POST_MICROSERVICE_PORT: Joi.number().required(),
  USER_MICROSERVICE_HOST: Joi.string().required(),
  USER_MICROSERVICE_PORT: Joi.number().required(),
  AUTH_MICROSERVICE_HOST: Joi.string().required(),
  AUTH_MICROSERVICE_PORT: Joi.number().required(),
  COMMENT_MICROSERVICE_HOST: Joi.string().required(),
  COMMENT_MICROSERVICE_PORT: Joi.number().required(),
}).unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
});

if (error) throw new Error(`Config calidation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  corsOrigin: envVars.CORS_ORIGIN,

  categoriasMicroserviceHost: envVars.CATEGORIAS_MICROSERVICE_HOST,
  categoriasMicroservicePort: envVars.CATEGORIAS_MICROSERVICE_PORT,

  postMicroserviceHost: envVars.POST_MICROSERVICE_HOST,
  postMicroservicePort: envVars.POST_MICROSERVICE_PORT,

  userMicroserviceHost: envVars.USER_MICROSERVICE_HOST,
  userMicroservicePort: envVars.USER_MICROSERVICE_PORT,

  authMicroserviceHost: envVars.AUTH_MICROSERVICE_HOST,
  authMicroservicePort: envVars.AUTH_MICROSERVICE_PORT,

  commentMicroserviceHost: envVars.COMMENT_MICROSERVICE_HOST,
  commentMicroservicePort: envVars.COMMENT_MICROSERVICE_PORT,
};