import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
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
      .expect(201)
      .then((res: request.Response) => {
        expect(res.body.task).toHaveProperty('title');
        expect(res.body.task).toHaveProperty('subtitle');
        expect(res.body.task).toHaveProperty('description');
        expect(res.body.task?.completed).toBe(false);
        taskId = res.body.task?._id;
      });
  });

  it('Task - get (GET)', async () => {
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

  it('Task - update (PATCH)', async () => {
    return await request(app.getHttpServer())
      .patch('/task')
      .set('Authorization', `Bearer ${token}`)
      .send({ _id: taskId, completed: true })
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
