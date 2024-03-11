import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserModule } from '../src/user/user.module';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { disconnect } from 'mongoose';

const user = {
  name: 'Dmytro',
  email: 'kotykhin_dm@ukr.net',
  password: '12345678',
};

describe('User', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('User registration (POST)', async () => {
    return await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name');
      });
  });

  let token: string;

  it('User login (POST)', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
      });
  });

  it('User login by token (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name');
      });
  });

  it('User login by token (GET) - Unauthorized', async () => {
    return await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${token}1`)
      .expect(401)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Authorization denied');
      });
  });

  it('User update name (PATCH)', async () => {
    return await request(app.getHttpServer())
      .patch('/user/name')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Dmytro Kotykhin' })
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('name');
        expect(res.body.name).toBe('Dmytro Kotykhin');
      });
  });

  it('User delete (DELETE)', async () => {
    return await request(app.getHttpServer())
      .delete('/user/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('message');
      });
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    disconnect();
    done();
  });
});
