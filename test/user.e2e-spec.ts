import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { disconnect } from 'mongoose';
import * as request from 'supertest';

import { UserModule } from '../src/user/user.module';
import { AppModule } from '../src/app.module';

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
    app.useGlobalPipes(new ValidationPipe());
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

  it('User registration (POST) - Email already exists', async () => {
    return await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(400)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe(`User ${user.email} already exists`);
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

  it('User login (POST) - Unauthorized', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'kotykhin_dmmm@ukr.net', password: user.password })
      .expect(401)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Incorrect login or password');
      });
  });

  it('User login (POST) - Incorrect password', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: '123456789' })
      .expect(400)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Incorrect login or password');
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
