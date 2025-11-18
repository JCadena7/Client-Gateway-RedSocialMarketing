import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../config/services';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignOutDto } from './dto/sign-out.dto';

@Controller('auths')
// @UseGuards(SupabaseAuthGuard)
export class AuthsController {
  constructor(@Inject(AUTH_SERVICE) private readonly authsService: ClientProxy) {}

  // Auth endpoints (Supabase)
  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authsService.send('auth.signUp', dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authsService.send('auth.signIn', dto);
  }

  @Post('validate-email')
  validateEmail(@Body() dto: ValidateEmailDto) {
    return this.authsService.send('auth.validateEmail', dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authsService.send('auth.refresh', dto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('usuarios')
  createUsuario(@Body() dto: CreateUsuarioDto) {
    return this.authsService.send('usuarios.create', dto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('sign-out')
  signOut(@Body() dto: SignOutDto) {
    console.log('🔵 Gateway - signOut:', dto);
  //   try {
  //     return this.authsService.send('auth.signOut', dto);
  //   } catch (error) {
  //     console.error('🔴 Gateway - Error al cerrar sesión:', error);
  //     throw error;
  //   }
  // }
    const response = this.authsService.send('auth.signOut', dto);
    console.log('🔵 Gateway - signOut response:', response);
    return response;
  }

  // CRUD endpoints
  @UseGuards(SupabaseAuthGuard)
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authsService.send('createAuth', createAuthDto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll() {
    return this.authsService.send('findAllAuths', {});
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authsService.send('findOneAuth', id);
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthDto: UpdateAuthDto
  ) {
    const payload = { id, ...updateAuthDto };
    return this.authsService.send('updateAuth', payload);
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authsService.send('removeAuth', id);
  }
}
