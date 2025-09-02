// import { Module } from '@nestjs/common';
// import { RbacService } from './rbac.service';
// import { RbacController } from './rbac.controller';

// @Module({
//   controllers: [RbacController],
//   providers: [RbacService],
// })
// export class RbacModule {}


import { Module } from '@nestjs/common';
import { RbacController } from './rbac.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, AUTH_SERVICE} from '../config';

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
})
export class RbacModule {}
