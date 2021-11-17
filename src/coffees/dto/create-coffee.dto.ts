import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

/* CreateCoffeeDto */
export class CreateCoffeeDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly brand: string;
  @IsString({ each: true })
  readonly flavors: string[];
}

/* UpdateCoffeeDto */
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
