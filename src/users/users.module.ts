import { Module, Global } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, USER_SERVICE} from '../config';

@Global()
@Module({
  controllers: [UsersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.userMicroserviceHost,
          port: envs.userMicroservicePort,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class UsersModule {}
