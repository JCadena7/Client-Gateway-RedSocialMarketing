import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
