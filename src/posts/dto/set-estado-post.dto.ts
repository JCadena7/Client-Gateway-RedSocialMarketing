import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class SetEstadoPostDto {
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsInt()
  @Type(() => Number)
  estado_id: number;
}
