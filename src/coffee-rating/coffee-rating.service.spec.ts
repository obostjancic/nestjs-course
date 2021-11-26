import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from '../coffees/coffees.service';
import { CoffeeRatingService } from './coffee-rating.service';

describe('CoffeeRatingService', () => {
  let service: CoffeeRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeeRatingService,
        { provide: CoffeesService, useValue: {} },
        // { provide: getRepositoryToken(Flavor), useValue: {} }, // 👈
        // { provide: getRepositoryToken(Coffee), useValue: {} }, // 👈],],
      ],
    }).compile();

    service = module.get<CoffeeRatingService>(CoffeeRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
