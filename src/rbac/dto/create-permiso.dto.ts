import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreatePermisoDto {
  @IsNotEmpty()
  @MaxLength(50)
  nombre!: string;

  @IsOptional()
  descripcion?: string | null;
}
