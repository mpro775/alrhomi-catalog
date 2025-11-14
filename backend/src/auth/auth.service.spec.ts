import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockJwtService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn().mockReturnValue({ secret: 'test-secret', expiresIn: '15m' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
