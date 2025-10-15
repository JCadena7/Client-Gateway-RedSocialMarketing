import { IsEmail, IsNotEmpty, IsInt, IsOptional, IsBoolean, IsString } from 'class-validator';

// Based on table `usuarios` in src/database/init-db.ts
export class CreateUsuarioDto {
  @IsOptional()
  @IsString()
  externalId?: string | null; // maps to usuarios.clerk_id

  @IsOptional()
  @IsString()
  username?: string | null;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  passwordHash?: string | null;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsOptional()
  @IsInt()
  rolId?: number | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  avatar?: string | null;

  @IsOptional()
  @IsString()
  bio?: string | null;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
