import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CreateRbacDto } from './dto/create-rbac.dto';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { AUTH_SERVICE } from '../config/services';
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { AssignPermisoToRoleDto } from './dto/assign-permiso-to-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { firstValueFrom } from 'rxjs';

@Controller('rbac')
export class RbacController {
  constructor(@Inject(AUTH_SERVICE) private readonly rbacService: ClientProxy) {}

  @UseGuards(SupabaseAuthGuard)
  @Post('roles')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rbacService.send('role.create', createRoleDto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('permisos')
  createPermiso(@Body() createPermisoDto: CreatePermisoDto) {
    return this.rbacService.send('permiso.create', createPermisoDto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('roles')
  findAllRoles() {
    return this.rbacService.send('role.list', {});
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('permisos')
  findAllpermisos() {
    return this.rbacService.send('permiso.list', {});
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('permisosByRole')
  listPermisosByRole(@Query() query: { rolId: number }) {
    return this.rbacService.send('rolePermiso.listByRole', query);
  }

  @Post('asignar/roles/:rolId/permisos')
  assign(
    @Param('rolId', ParseIntPipe) rolId: number,
    @Body() dto: AssignPermisoToRoleDto,
  ) {
    return this.rbacService.send('rolePermiso.assign', { ...dto, rolId });
  }

  // Gateway - cambiar para enviar camelCase
  @UseGuards(SupabaseAuthGuard)
  @Delete('roles/:roleId/permisos/:permisoId')
  async remove(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permisoId', ParseIntPipe) permisoId: number,
  ) {
    // console.log('Gateway - roleId:', roleId);
    // console.log('Gateway - permisoId:', permisoId);
    
    try {
      const respuesta = await firstValueFrom(
        this.rbacService.send('rolePermiso.revoke', { 
          rolId: roleId,        // ✅ camelCase para coincidir con DTO
          permisoId: permisoId  // ✅ camelCase para coincidir con DTO
        })
      );
      
      // console.log('Gateway - respuesta:', respuesta);
      return respuesta;
    } catch (error) {
      console.error('Gateway - error:', error);
      throw error;
    }
  }
}
