import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';

type ResponseType = {
  status: number;
  body: { data: { emoji?: string; browser?: string } };
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: App;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appService = app.get<AppService>(AppService);
    server = app.getHttpServer();
    await app.init();
  });

  describe("[GET]: '/'", () => {
    // When no API Key, return 403;
    it('Should return 403 when an API Key is not used', () => {
      return request(server).get('/').expect(403);
    });

    // When invalid API Key, return 403;
    it('Should return 403 when an invalid API Key is used', () => {
      return request(server)
        .get('/')
        .set('x-api-key', 'INVALID_SECRET')
        .expect(403);
    });
    // When valid API Key, GET must return 200 with a random emoji;
    it('Should return a random emoji and 200 HTTP Code', () => {
      return request(server)
        .get('/')
        .set('x-api-key', 'SECRET_SAUCE')
        .expect(({ status, body }: ResponseType) => {
          expect(status).toBe(200);
          expect(appService.getEmojis()).toContain(body.data.emoji);
          expect(body.data.browser).toBe('Unknown');
        });
    });

    it('Should return respective user-agent and 200 HTTP Code', () => {
      return request(server)
        .get('/')
        .set('user-agent', 'PostmanRuntime/7.44.1')
        .set('x-api-key', 'SECRET_SAUCE')
        .expect(({ status, body }: ResponseType) => {
          expect(status).toBe(200);
          expect(body.data.browser).toBe('PostmanRuntime/7.44.1');
        });
    });

    // When params ? index = 0, GET must return 200 with the first emoji;
    it('Should return the respective emoji that matches the index param and 200 HTTP Code', () => {
      const index = 0;
      return request(server)
        .get(`/?index=${index}`)
        .set('x-api-key', 'SECRET_SAUCE')
        .expect(({ status, body }: ResponseType) => {
          expect(status).toBe(200);
          expect(body.data.emoji).toBe(appService.getEmoji(index));
        });
    });

    // When params ?index=100, GET must return 400 (out of emoji arr range);
    it('Should return 400 HTTP Status Code when an out of range index is passed through params', () => {
      const range = appService.getEmojis().length + 1;
      return request(server)
        .get(`/?index=${range}`)
        .set('x-api-key', 'SECRET_SAUCE')
        .expect(({ status }: ResponseType) => {
          expect(status).toBe(400);
        });
    });

    // When params?index=not-a-number, GET must return 400;
    it('Should return 400 HTTP Status Code when a not-a-number is passed through params', () => {
      const NAN = 'DEFINITELY_NOT_A_NUMBER';
      return request(server)
        .get(`/?index=${NAN}`)
        .set('x-api-key', 'SECRET_SAUCE')
        .expect(({ status }: ResponseType) => {
          expect(status).toBe(400);
        });
    });
  });
});
