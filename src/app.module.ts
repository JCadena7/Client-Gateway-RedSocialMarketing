import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { EstadosModule } from './estados/estados.module';
import { AuthsModule } from './auths/auths.module';
import { RbacModule } from './rbac/rbac.module';
import { UserActivitiesModule } from './user-activities/user-activities.module';
import { ComentariosModule } from './comments/comentarios.module';

@Module({
  imports: [CategoriasModule, PostsModule, UsersModule, EstadosModule, AuthsModule, RbacModule, UserActivitiesModule, ComentariosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
