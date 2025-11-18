import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { USER_SERVICE } from '../config/services';
import { FindUsersDto } from './dto/find-users.dto';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { RequirePermisos } from '../auth/decorators/permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Express } from 'express';

@Controller('users')
export class UsersController {
  constructor(@Inject(USER_SERVICE) private readonly usersService: ClientProxy) {}

  @UseGuards(SupabaseAuthGuard, RbacGuard)
  @RequirePermisos('admin_completo')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.send('createUser', createUserDto);
  }

  @UseGuards(SupabaseAuthGuard, RbacGuard)
  @RequirePermisos('admin_completo')
  @Get()
  findAll(@Query() query: FindUsersDto) {
    return this.usersService.send('findAllUsers', query);
  }

  @UseGuards(SupabaseAuthGuard, RbacGuard)
  @RequirePermisos('admin_completo')
  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.send('findUserByUsername', { username });
  }

  @UseGuards(SupabaseAuthGuard, RbacGuard)
  @RequirePermisos('admin_completo')
  @Get('clerk/:clerkId')
  findByClerkId(@Param('clerkId') clerkId: string) {
    return this.usersService.send('findUserByClerkId', { clerkId });
  }

  @UseGuards(SupabaseAuthGuard, RbacGuard)
  @RequirePermisos('admin_completo')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.send('findOneUser', { id });
  }

  @UseGuards(SupabaseAuthGuard, RbacGuard)
  @RequirePermisos('admin_completo')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.send('updateUser', { id, ...updateUserDto });
  }

  @UseGuards(SupabaseAuthGuard, RbacGuard)
  @RequirePermisos('admin_completo')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.send('removeUser', { id });
  }

  @UseGuards(SupabaseAuthGuard)
  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('El archivo es requerido');
    }
    return this.usersService.send('uploadUserAvatar', {
      userId: id,
      file: this.serializeFile(file),
    });
  }

  @UseGuards(SupabaseAuthGuard)
  @Post(':id/cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadCover(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('El archivo es requerido');
    }
    return this.usersService.send('uploadUserCoverImage', {
      userId: id,
      file: this.serializeFile(file),
    });
  }

  private serializeFile(file: Express.Multer.File) {
    return {
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    };
  }
}
