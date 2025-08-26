import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoDto } from './create-estado.dto';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEstadoDto extends PartialType(CreateEstadoDto) {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;
}
