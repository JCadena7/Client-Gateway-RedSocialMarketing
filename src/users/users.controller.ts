import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { USER_SERVICE } from '../config/services';
import { FindUsersDto } from './dto/find-users.dto';
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@Inject(USER_SERVICE) private readonly usersService: ClientProxy) {}

  @UseGuards(SupabaseAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.send('createUser', createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.send('findAllUsers', {});
  // }
  @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll(@Query() query: FindUsersDto) {
    return this.usersService.send('findAllUsers', query);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.send('findOneUser', { id });
  }

  @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.send('updateUser', { id, ...updateUserDto });
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.send('removeUser', { id });
  }
}
