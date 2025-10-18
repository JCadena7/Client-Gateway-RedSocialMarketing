import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { CreateUserActivityDto } from './dto/create-user-activity.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { USER_SERVICE } from '../config/services';
import { FindUserActivitiesDto } from './dto/find-user-activities.dto';
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { RbacGuard } from '../auth/guards/rbac.guard';
import { RequirePermisos } from '../auth/decorators/permissions.decorator';

@Controller('user-activities')
@UseGuards(SupabaseAuthGuard, RbacGuard)
@RequirePermisos('admin_completo')
export class UserActivitiesController {
  constructor(@Inject(USER_SERVICE) private readonly userActivitiesService: ClientProxy) {}

  @UseGuards(SupabaseAuthGuard)
  @Post()
  create(@Body() createUserActivityDto: CreateUserActivityDto) {
    return this.userActivitiesService.send('createUserActivity', createUserActivityDto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll(@Query() query: FindUserActivitiesDto) {
    return this.userActivitiesService.send('findAllUserActivities', query);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: number, @Query() params?: FindUserActivitiesDto) {
    return this.userActivitiesService.send('findUserActivitiesByUserId', { userId, params });
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userActivitiesService.send('findOneUserActivity', { id });
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete('user/:userId')
  removeByUserId(@Param('userId') userId: number) {
    return this.userActivitiesService.send('removeUserActivitiesByUserId', { userId });
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userActivitiesService.send('removeUserActivity', { id });
  }
}
