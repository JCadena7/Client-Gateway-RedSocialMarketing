import { Module } from '@nestjs/common';
import { AuthsController } from './auths.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, AUTH_SERVICE} from '../config';

@Module({
  controllers: [AuthsController],
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
})
export class AuthsModule {}
