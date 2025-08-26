import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt } from 'class-validator';

export class AddCategoriasPostDto {
  @IsInt()
  @Type(() => Number)
  post_id: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Type(() => Number)
  categoria_ids: number[];
}
