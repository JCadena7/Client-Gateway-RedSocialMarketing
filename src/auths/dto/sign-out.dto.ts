import { IsOptional, IsString } from 'class-validator';

export class SignOutDto {
  @IsOptional()
  @IsString()
  accessToken?: string | null;
}
