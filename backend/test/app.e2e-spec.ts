import {  Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/login (POST) - should return 401 for invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'invalid', password: 'invalid' })
      .expect(401);
  });
});
