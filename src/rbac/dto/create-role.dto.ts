import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @MaxLength(50)
  nombre!: string;

  @IsOptional()
  descripcion?: string | null;
}
