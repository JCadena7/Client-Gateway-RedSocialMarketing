import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
// import { CATEGORIA_SERVICE } from '../config/services';
import { envs, CATEGORIA_SERVICE} from '../config';

@Module({
  controllers: [CategoriasController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: CATEGORIA_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.categoriasMicroserviceHost,
          port: envs.categoriasMicroservicePort,
        },
      },
    ]),
  ],
})
export class CategoriasModule {}
