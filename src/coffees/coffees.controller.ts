import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { Protocol } from '../common/decorators/protocol.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PaginatonQueryDto } from '../common/dto/paginaton-query.dto';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {
    // console.log('INIT controller');
  }

  @Get()
  @Public()
  @ApiForbiddenResponse()
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginatonQueryDto,
  ): Promise<Coffee[]> {
    console.log('protocol :>> ', protocol);
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string): Promise<Coffee> {
    return this.coffeesService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateCoffeeDto): Promise<Coffee> {
    return this.coffeesService.create(body);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCoffeeDto,
  ): Promise<Coffee> {
    return this.coffeesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Coffee> {
    return this.coffeesService.remove(id);
  }
}
