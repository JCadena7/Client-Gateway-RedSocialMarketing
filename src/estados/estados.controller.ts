import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { POST_SERVICE } from '../config/services';
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('estados')
@UseGuards(SupabaseAuthGuard) 
export class EstadosController {
  constructor(@Inject(POST_SERVICE) private readonly estadosService: ClientProxy) {}

  // @UseGuards(SupabaseAuthGuard)
  @Post()
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadosService.send('createEstado', createEstadoDto);
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll() {
    return this.estadosService.send('findAllEstados', {});
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.estadosService.send('findOneEstado', { id });
  }

  // @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateEstadoDto: UpdateEstadoDto) {
    return this.estadosService.send('updateEstado', { id, ...updateEstadoDto });
  }

  // @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.estadosService.send('removeEstado', { id });
  }
}
