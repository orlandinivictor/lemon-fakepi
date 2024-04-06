import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '@src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/healthcheck (GET)', () => {
    const healthMock = {
      status: 'ok',
      info: {},
      error: {},
      details: {},
    };

    return request(app.getHttpServer())
      .get('/healthcheck')
      .expect(200)
      .expect(healthMock);
  });

  it('/not-found-route (GET)', () => {
    const notFoundMock = {
      message: 'Cannot GET /not-found-route',
      error: 'Not Found',
      statusCode: 404,
    };

    return request(app.getHttpServer())
      .get('/not-found-route')
      .expect(404)
      .expect(notFoundMock);
  });
});
