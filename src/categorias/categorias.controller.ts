import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CATEGORIA_SERVICE } from '../config/services';
import { ClientProxy } from '@nestjs/microservices';

@Controller('categorias')
export class CategoriasController {
  constructor(@Inject(CATEGORIA_SERVICE) private readonly categoriasService: ClientProxy) {}

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.send('createCategoria', createCategoriaDto);
  }

  @Get()
  findAll() {
    return this.categoriasService.send('findAllCategorias', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriasService.send('findOneCategoria', { id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.send('updateCategoria', { id, updateCategoriaDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriasService.send('removeCategoria', { id });
  }
}
