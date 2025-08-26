import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CategoriasModule, PostsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
