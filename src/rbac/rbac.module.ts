import { Module, Global } from '@nestjs/common';
import { RbacController } from './rbac.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, AUTH_SERVICE} from '../config';

@Global()
@Module({
  controllers: [RbacController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.authMicroserviceHost,
          port: envs.authMicroservicePort,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RbacModule {}
