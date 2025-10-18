import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { COMMENT_SERVICE } from '../config/services';
import { ClientProxy } from '@nestjs/microservices';
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { FindAllComentariosDto } from './dto/find-all-comentarios.dto';
import { ModerateComentarioDto } from './dto/moderate-comentario.dto';

@Controller('comentarios')
@UseGuards(SupabaseAuthGuard) 
export class ComentariosController {
  constructor(@Inject(COMMENT_SERVICE) private readonly comentariosService: ClientProxy) {}

  @Post()
  create(@Body() createComentarioDto: CreateComentarioDto) {
    return this.comentariosService.send('createComentario', createComentarioDto);
  }

  @Get()
  findAll(@Query() query: FindAllComentariosDto) {
    return this.comentariosService.send('findAllComentarios', query);
  }

  @Get('stats/general')
  getStats() {
    return this.comentariosService.send('getComentariosStats', {});
  }

  @Get('stats/top-commented')
  getTopCommented(@Query('limit', ParseIntPipe) limit: number = 10) {
    return this.comentariosService.send('getTopCommentedPosts', { limit });
  }

  @Get('stats/most-active')
  getMostActive(@Query('limit', ParseIntPipe) limit: number = 10) {
    return this.comentariosService.send('getMostActiveCommenters', { limit });
  }

  @Get('post/:postId')
  findByPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('withReplies') withReplies?: string
  ) {
    return this.comentariosService.send('findComentariosByPost', { 
      postId,
      withReplies: withReplies === 'true'
    });
  }

  @Get(':id/replies')
  findReplies(@Param('id', ParseIntPipe) id: number) {
    return this.comentariosService.send('findComentarioReplies', { parentId: id });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withUser') withUser?: string
  ) {
    return this.comentariosService.send('findOneComentario', { 
      id,
      withUser: withUser === 'true'
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComentarioDto: UpdateComentarioDto,
  ) {
    const payload = { id, ...updateComentarioDto };
    return this.comentariosService.send('updateComentario', payload);
  }

  @Patch(':id/moderate')
  moderate(
    @Param('id', ParseIntPipe) id: number,
    @Body() moderateComentarioDto: ModerateComentarioDto,
  ) {
    const payload = { id, ...moderateComentarioDto };
    return this.comentariosService.send('moderateComentario', payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comentariosService.send('removeComentario', { id });
  }
}
