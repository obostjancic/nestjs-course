import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll(): Coffee[] {
    return this.coffees;
  }

  findOne(id: string): Coffee {
    const coffee = this.coffees.find(item => item.id === +id);
    if (!coffee) throw new NotFoundException('Coffee not found');
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto): void {
    this.coffees.push(createCoffeeDto as Coffee);
  }

  update(id: string, updateCoffeeDto: UpdateCoffeeDto): void {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      this.remove(existingCoffee.id + '');
      this.create({ id, ...updateCoffeeDto } as CreateCoffeeDto);
      // update the existing entity
    }
  }

  remove(id: string): void {
    const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
