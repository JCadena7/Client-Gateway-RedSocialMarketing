import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { POST_SERVICE } from '../config/services';

@Controller('estados')
export class EstadosController {
  constructor(@Inject(POST_SERVICE) private readonly estadosService: ClientProxy) {}

  @Post()
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadosService.send('createEstado', createEstadoDto);
  }

  @Get()
  findAll() {
    return this.estadosService.send('findAllEstados', {});
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.estadosService.send('findOneEstado', { id });
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateEstadoDto: UpdateEstadoDto) {
    return this.estadosService.send('updateEstado', { id, ...updateEstadoDto });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.estadosService.send('removeEstado', { id });
  }
}
