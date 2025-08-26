import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { AUTH_SERVICE } from '../config/services';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('auths')
export class AuthsController {
  constructor(@Inject(AUTH_SERVICE) private readonly authsService: ClientProxy) {}

    // NUEVOS endpoints que mapean a los patrones DDD (Supabase)
    @Post('sign-up')
    signUp(@Body() dto: SignUpDto) {
      // auth-ms -> @MessagePattern('auth.signUp')
      return this.authsService.send('auth.signUp', dto);
    }
  
    @Post('sign-in')
    signIn(@Body() dto: SignInDto) {
      // auth-ms -> @MessagePattern('auth.signIn')
      return this.authsService.send('auth.signIn', dto);
    }
  
    @UseGuards(SupabaseAuthGuard)
    @Post('usuarios')
    createUsuario(@Body() dto: CreateUsuarioDto) {
      // auth-ms -> @MessagePattern('usuarios.create')
      return this.authsService.send('usuarios.create', dto);
    }
}
