import { Module } from '@nestjs/common';
import { EstadosController } from './estados.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, POST_SERVICE} from '../config';

@Module({
  controllers: [EstadosController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: POST_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.postMicroserviceHost,
          port: envs.postMicroservicePort,
        },
      },
    ]),
  ],
})
export class EstadosModule {}
