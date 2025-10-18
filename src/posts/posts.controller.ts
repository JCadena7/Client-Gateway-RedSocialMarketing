import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { POST_SERVICE } from '../config/services';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { AddCategoriasPostDto } from './dto/add-categorias-post.dto';
import { FindPostsDto } from './dto/find-posts.dto';
import { UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(@Inject(POST_SERVICE) private readonly postsService: ClientProxy) {}

  // @UseGuards(SupabaseAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.send('createPost', createPostDto);
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get()
  findAll(@Query() query: FindPostsDto) {
    return this.postsService.send('findAllPosts', query);
  }

  // ==================== ENDPOINTS QUE USAN VISTAS ====================

  @Get('completos')
  findPostsCompletos(@Query('limit') limit?: number) {
    return this.postsService.send('findPostsCompletos', { limit: limit ?? 20 });
  }

  @Get('populares')
  findPostsPopulares(@Query('limit') limit?: number) {
    return this.postsService.send('findPostsPopulares', { limit: limit ?? 10 });
  }

  @Get('trending')
  findPostsTrending(@Query('limit') limit?: number) {
    return this.postsService.send('findPostsTrending', { limit: limit ?? 10 });
  }

  @Get('engagement')
  findPostsConEngagement(@Query('limit') limit?: number) {
    return this.postsService.send('findPostsConEngagement', { limit: limit ?? 20 });
  }

  @Get('sin-comentarios')
  findPostsSinComentarios() {
    return this.postsService.send('findPostsSinComentarios', {});
  }

  @Get('mas-compartidos')
  findPostsMasCompartidos(@Query('limit') limit?: number) {
    return this.postsService.send('findPostsMasCompartidos', { limit: limit ?? 10 });
  }

  @Get('borradores-antiguos')
  findBorradoresAntiguos() {
    return this.postsService.send('findBorradoresAntiguos', {});
  }

  @Get('stats/por-mes')
  getEstadisticasPorMes(@Query('meses') meses?: number) {
    return this.postsService.send('getEstadisticasPorMes', { meses: meses ?? 12 });
  }

  @Get('stats/mejor-rendimiento/:autorId')
  findMejorRendimientoPorAutor(@Param('autorId') autorId: number, @Query('limit') limit?: number) {
    return this.postsService.send('findMejorRendimientoPorAutor', { autorId, limit: limit ?? 5 });
  }

  @Get('stats/dashboard')
  getDashboardOverview() {
    return this.postsService.send('getDashboardOverview', {});
  }

  // ==================== ENDPOINTS QUE USAN TRIGGERS ====================

  @Post('vista/:postId')
  incrementarVista(@Param('postId') postId: number, @Body() body: { userId?: number; ipAddress?: string }) {
    return this.postsService.send('incrementarVista', { postId, userId: body.userId, ipAddress: body.ipAddress });
  }

  @Post('like/:postId')
  darLike(@Param('postId') postId: number, @Body() body: { userId: number }) {
    return this.postsService.send('darLike', { postId, userId: body.userId });
  }

  @Delete('like/:postId')
  quitarLike(@Param('postId') postId: number, @Body() body: { userId: number }) {
    return this.postsService.send('quitarLike', { postId, userId: body.userId });
  }

  // ==================== ENDPOINTS PARA KEYWORDS ====================

  /**
   * Buscar o crear keyword por nombre
   */
  @Post('keywords/find-or-create')
  findOrCreateKeyword(@Body() body: { keyword: string }) {
    return this.postsService.send('findOrCreateKeyword', { keyword: body.keyword });
  }

  /**
   * Obtener keywords más usadas
   */
  @Get('keywords/mas-usadas')
  getKeywordsMasUsadas(@Query('limit') limit?: number) {
    return this.postsService.send('getKeywordsMasUsadas', { limit: limit ?? 50 });
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.send('findOnePost', { id });
  }

  // @UseGuards(SupabaseAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.send('updatePost', { id, ...updatePostDto });
  }

  // @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    console.log('Gateway - ID en posts:', id);
    return this.postsService.send('removePost', { id });
  }

  // @UseGuards(SupabaseAuthGuard)
  @Post(':id/add-categorias')
  addCategorias(@Param('id') id: number, @Body() addCategoriasDto: AddCategoriasPostDto) {
    return this.postsService.send('addCategoriasPost', { id, ...addCategoriasDto });
  }

  /**
   * Agregar keywords existentes a un post
   */
  @Post(':postId/keywords')
  addKeywords(@Param('postId') postId: number, @Body() body: { keywordIds: number[] }) {
    return this.postsService.send('addKeywordsToPost', { postId, keywordIds: body.keywordIds });
  }

  /**
   * Crear nuevas keywords y asociarlas a un post
   */
  @Post(':postId/keywords/create')
  createAndAddKeywords(@Param('postId') postId: number, @Body() body: { keywords: string[] }) {
    return this.postsService.send('createAndAddKeywords', { postId, keywords: body.keywords });
  }

  /**
   * Obtener keywords de un post
   */
  @Get(':postId/keywords')
  getPostKeywords(@Param('postId') postId: number) {
    return this.postsService.send('getPostKeywords', { postId });
  }

  /**
   * Eliminar keywords de un post
   */
  @Delete(':postId/keywords')
  removeKeywords(@Param('postId') postId: number, @Body() body: { keywordIds?: number[] }) {
    return this.postsService.send('removeKeywordsFromPost', { postId, keywordIds: body.keywordIds });
  }
}
