import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel: any;
  let mockImageModel: any;

  beforeEach(async () => {
    mockProductModel = {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([]),
              }),
            }),
          }),
        }),
      }),
      countDocuments: jest.fn().mockResolvedValue(0),
      findById: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    mockImageModel = {
      countDocuments: jest.fn().mockResolvedValue(0),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken('Image'),
          useValue: mockImageModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
