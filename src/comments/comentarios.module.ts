import { Module } from '@nestjs/common';
import { ComentariosController } from './comentarios.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
// import { CATEGORIA_SERVICE } from '../config/services';
import { envs, COMMENT_SERVICE} from '../config';

@Module({
  controllers: [ComentariosController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: COMMENT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.commentMicroserviceHost,
          port: envs.commentMicroservicePort,
        },
      },
    ]),
  ],
})
export class ComentariosModule {}
