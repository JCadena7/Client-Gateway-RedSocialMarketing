import { Type } from 'class-transformer';
// import { IsInt, IsNotEmpty } from 'class-validator';

import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @IsString()
  @IsOptional()
  extracto?: string;

  @IsString()
  @IsOptional()
  contenido?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  imagen_destacada?: string;

  @IsInt()
  @Type(() => Number)
  usuario_id: number;

  @IsInt()
  @Type(() => Number)
  estado_id: number;

  @IsDateString()
  @IsOptional()
  fecha_publicacion?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  palabras_clave?: string[];

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  tiempo_lectura?: number;

  // Categorías opcionales a asociar al crear el post
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  categoria_ids?: number[];
}
