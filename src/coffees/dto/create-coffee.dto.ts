import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/* CreateCoffeeDto */
export class CreateCoffeeDto {
  @IsString()
  @ApiProperty()
  readonly name: string;
  @IsString()
  readonly brand: string;
  @IsString({ each: true })
  readonly flavors: string[];
}

/* UpdateCoffeeDto */
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
