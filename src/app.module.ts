import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { AvatarModule } from './avatar/avatar.module';
import { MailModule } from './mail/mail.module';
import { mongoDBConfig } from './configs/mongoDB.config';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TaskModule,
    AvatarModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MongooseModule.forRoot(process.env.MONGO_DB),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongoDBConfig,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
