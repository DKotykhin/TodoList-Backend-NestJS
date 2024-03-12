import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { disconnect } from 'mongoose';
import * as request from 'supertest';

import { UserModule } from '../src/user/user.module';
import { TaskModule } from '../src/task/task.module';
import { AppModule } from '../src/app.module';

const user = {
  email: 'kotykhin_d@ukr.net',
  password: '12345678',
};

const task = {
  title: 'Task for test 1',
  subtitle: 'Subtitle 1',
  description: 'Description 1',
};

describe('User', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule, TaskModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  let token: string;
  let taskId: string;

  it('Task - user login (POST)', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
      });
  });

  it('Task - create (POST)', async () => {
    return await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send(task)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res: request.Response) => {
        expect(res.body.task).toHaveProperty('title');
        expect(res.body.task).toHaveProperty('subtitle');
        expect(res.body.task).toHaveProperty('description');
        expect(res.body.task?.completed).toBe(false);
        taskId = res.body.task?._id;
      });
  });

  it('Task - create (POST) - validation error', async () => {
    return await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'T',
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        statusCode: 400,
        message: ['Title must be between 2 and 30 characters'],
        error: 'Bad Request',
      });
    // .then((res: request.Response) => {
    //   expect(res.body).toHaveProperty('message');
    //   expect(res.body.error).toBe('Bad Request');
    // });
  });

  it('Task - get all (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/task')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('totalTasksQty');
        expect(res.body).toHaveProperty('totalPagesQty');
        expect(res.body).toHaveProperty('tasksOnPageQty');
        expect(res.body).toHaveProperty('tasks');
        expect(res.body.tasks.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('Task - get by id (GET)', async () => {
    return await request(app.getHttpServer())
      .get(`/task/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('title');
        expect(res.body).toHaveProperty('subtitle');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('completed');
        expect(res.body._id).toBe(taskId);
      });
  });

  it('Task - get by id (GET) - not found', async () => {
    return await request(app.getHttpServer())
      .get(`/task/1234567890`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Task not found');
      });
  });

  it('Task - update (PATCH)', async () => {
    return await request(app.getHttpServer())
      .patch('/task')
      .set('Authorization', `Bearer ${token}`)
      .send({ _id: taskId, completed: true, ...task })
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body.task?.completed).toBe(true);
      });
  });

  it('Task - delete (DELETE)', async () => {
    return await request(app.getHttpServer())
      .delete(`/task`)
      .set('Authorization', `Bearer ${token}`)
      .send({ _id: taskId })
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
