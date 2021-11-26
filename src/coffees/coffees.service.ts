import { Injectable, NotFoundException } from '@nestjs/common';
// import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatonQueryDto } from '../common/dto/paginaton-query.dto';
import { Event } from '../events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
// import { COFFEE_BRANDS } from './coffees.constants';
// import coffeesConfig from './config/coffees.config';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection, // @Inject(COFFEE_BRANDS) private readonly coffeeBrands: string[], // private readonly configService: ConfigService, // @Inject(coffeesConfig.KEY)
  ) // private coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  {
    // console.log(this.coffeesConfiguration.foo);
    // const databaseHost = this.configService.get('database.host');
    // console.log('INIT', databaseHost);
  }

  findAll(paginationQuery: PaginatonQueryDto): Promise<Coffee[]> {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto): Promise<Coffee> {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
      ));
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string): Promise<Coffee> {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const flavor = await this.flavorRepository.findOne({ where: { name } });
    if (flavor) return flavor;

    return this.flavorRepository.create({ name });
  }

  async reccomendCoffee(coffee: Coffee): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;
      const recommendedEvent = new Event();
      recommendedEvent.name = 'recommend_coffee';
      recommendedEvent.type = 'coffee';
      recommendedEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendedEvent);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
