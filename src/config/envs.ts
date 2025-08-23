import * as Joi from 'joi';
import 'dotenv/config';

interface EnvVars {
  PORT: number;
  CATEGORIAS_MICROSERVICE_HOST: string;
  CATEGORIAS_MICROSERVICE_PORT: number;
}

const envSchema = Joi.object({
  PORT: Joi.number().required(),
  CATEGORIAS_MICROSERVICE_HOST: Joi.string().required(),
  CATEGORIAS_MICROSERVICE_PORT: Joi.number().required(),
}).unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
});

if (error) throw new Error(`Config calidation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  categoriasMicroserviceHost: envVars.CATEGORIAS_MICROSERVICE_HOST,
  categoriasMicroservicePort: envVars.CATEGORIAS_MICROSERVICE_PORT,
};