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
}
