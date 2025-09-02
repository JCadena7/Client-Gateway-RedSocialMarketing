import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignPermisoToRoleDto {
  @Type(() => Number)
  @IsInt()
  rolId!: number;

  @Type(() => Number)
  @IsInt()
  permisoId!: number;
}
