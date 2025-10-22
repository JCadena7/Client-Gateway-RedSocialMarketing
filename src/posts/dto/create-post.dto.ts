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
  IsNumber,
  ValidateNested,
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

  // Keywords - IDs de palabras clave existentes o nuevas a crear
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  keyword_ids?: number[];

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  tiempo_lectura?: number;

  // Categorías opcionales a asociar al crear el post
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  categoria_ids?: number[];

  // Nuevas keywords como strings (se crearán automáticamente)
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  new_keywords?: string[];

  // ==================== CAMPOS SEO OPCIONALES ====================
  @IsOptional()
  @IsString()
  @MaxLength(255)
  meta_title?: string;

  @IsOptional()
  @IsString()
  meta_description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  focus_keyword?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readabilityScore?: number;

  // ==================== CAMPOS EDITORIAL OPCIONALES ====================
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  reviewer_id?: number;

  @IsOptional()
  @IsDateString()
  review_date?: string;

  @IsOptional()
  @IsString()
  review_notes?: string;
}
