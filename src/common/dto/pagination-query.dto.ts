import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  offset: number;
}
