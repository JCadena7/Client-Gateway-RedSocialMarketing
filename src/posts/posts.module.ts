import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, POST_SERVICE} from '../config';

@Module({
  controllers: [PostsController],
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
export class PostsModule {}
