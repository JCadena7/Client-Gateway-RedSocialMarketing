import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  first_name!: string;

  @IsNotEmpty()
  last_name!: string;

  @IsOptional()
  username?: string;

  @IsOptional()
  phone?: string;
}
