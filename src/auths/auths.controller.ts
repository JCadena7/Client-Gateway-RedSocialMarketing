import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { AUTH_SERVICE } from '../config/services';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('auths')
export class AuthsController {
  constructor(@Inject(AUTH_SERVICE) private readonly authsService: ClientProxy) {}

  @Post()   
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authsService.send('createAuth', createAuthDto);
  }

  @Get()
  findAll() {
    return this.authsService.send('findAllAuths', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authsService.send('findOneAuth', { id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authsService.send('updateAuth', { id, ...updateAuthDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authsService.send('removeAuth', { id });
  }

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
  
    @Post('usuarios')
    createUsuario(@Body() dto: CreateUsuarioDto) {
      // auth-ms -> @MessagePattern('usuarios.create')
      return this.authsService.send('usuarios.create', dto);
    }
}
