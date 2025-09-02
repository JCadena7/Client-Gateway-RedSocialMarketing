import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class RevokeManyPermisosFromRoleDto {
  @Type(() => Number)
  @IsInt()
  rolId!: number;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  permisoIds!: number[];
}
