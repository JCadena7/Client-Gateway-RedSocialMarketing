import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRevisionPostDto {
  @IsInt()
  @Type(() => Number)
  post_id: number;

  @IsString()
  @IsOptional()
  contenido_anterior?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  estado_anterior?: number;

  @IsInt()
  @Type(() => Number)
  usuario_id: number;

  @IsString()
  @IsOptional()
  comentario?: string;
}
