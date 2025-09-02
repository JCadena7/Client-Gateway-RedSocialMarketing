import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CATEGORIA_SERVICE } from '../config/services';
import { ClientProxy } from '@nestjs/microservices';
import { FindAllCategoriasDto } from './dto/find-all-categorias.dto';
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('categorias')
@UseGuards(SupabaseAuthGuard) 
export class CategoriasController {
  constructor(@Inject(CATEGORIA_SERVICE) private readonly categoriasService: ClientProxy) {}

  // @UseGuards(SupabaseAuthGuard) 
  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    console.log("createCategoriaDto", createCategoriaDto);
    return this.categoriasService.send('createCategoria', createCategoriaDto);
  }

  // @UseGuards(SupabaseAuthGuard) 
  @Get()
  findAll(@Query() query: FindAllCategoriasDto) {
    console.log('Gateway - Query recibido:', query);
    
    return this.categoriasService.send('findAllCategorias', query);
  }

  // @UseGuards(SupabaseAuthGuard) 
  @Get(':id')
  findOne(
    @Param('id') id: number,
    @Query('withPosts') withPosts?: string  // 👈 AGREGAR ESTO
  ) {
  console.log('Gateway - ID:', id, 'withPosts:', withPosts);
  
  return this.categoriasService.send('findOneCategoria', { 
    id,
    withPosts: withPosts === 'true'  // 👈 CONVERTIR STRING A BOOLEAN
  });
}

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updateCategoriaDto: UpdateCategoriaDto) {
  //   console.log("id", id);
  //   console.log("updateCategoriaDto", updateCategoriaDto);
  //   return this.categoriasService.send('updateCategoria', { id, updateCategoriaDto });
  // }



  // @UseGuards(SupabaseAuthGuard) 
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    // Prioriza id del path
    const payload = { id, ...updateCategoriaDto };
    return this.categoriasService.send('updateCategoria', payload);
  }

  // @UseGuards(SupabaseAuthGuard) 
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriasService.send('removeCategoria', { id });
  }
}
