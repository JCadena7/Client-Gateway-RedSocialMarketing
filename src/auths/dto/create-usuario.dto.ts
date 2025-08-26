import { IsEmail, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

// Based on table `usuarios` in src/database/init-db.ts
export class CreateUsuarioDto {
  @IsOptional()
  externalId?: string | null; // maps to usuarios.clerk_id

  @IsNotEmpty()
  nombre!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsInt()
  rolId?: number | null;
}
