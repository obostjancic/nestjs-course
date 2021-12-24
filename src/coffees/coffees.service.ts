import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  private coffees: Coffee[] = [];

  findAll(paginationQuery: PaginationQueryDto): Coffee[] {
    const { limit, offset } = paginationQuery;
    //@ts-ignore
    return this.coffeeModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();
  }

  findOne(id: string): Coffee {
    const coffee = this.coffeeModel.findOne({ _id: id }).exec();
    if (!coffee) throw new NotFoundException('Coffee not found');
    //@ts-ignore
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto): void {
    const coffee = new this.coffeeModel(createCoffeeDto as Coffee);
    //@ts-ignore
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();

    if (!existingCoffee) throw new NotFoundException(`Coffee #${id} not found`);

    //@ts-ignore
    return existingCoffee;
  }

  async remove(id: string): Promise<Coffee> {
    const coffee = await this.findOne(id);
    return coffee.remove();
  }

  async recommendCoffee(coffee: Coffee): Promise<any> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });
      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }
}
