import { IsNotEmpty, MinLength, ValidateIf } from 'class-validator';

export class SignInDto {
  @ValidateIf(o => !o.username)
  @IsNotEmpty({ message: 'Email o username es requerido' })
  email?: string;

  @ValidateIf(o => !o.email)
  @IsNotEmpty({ message: 'Email o username es requerido' })
  username?: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
