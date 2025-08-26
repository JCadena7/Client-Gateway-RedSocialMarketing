import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class FindPostsDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  paginate?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  usuario_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  estado_id?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Type(() => Number)
  categoria_ids?: number[];
}
