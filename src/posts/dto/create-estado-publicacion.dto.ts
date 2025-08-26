import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEstadoPublicacionDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
