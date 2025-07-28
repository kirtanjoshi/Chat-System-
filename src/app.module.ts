/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';
import { MailService } from './auth/dto/mail.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000,
      username: 'postgres',
      password: 'kirtan123',
      database: 'chat_application_db_fastify',
      autoLoadEntities: true,
      synchronize: true,
      logging: true, //Shows Connection status
    }),

    ChatModule,
    AuthModule,
    FirebaseAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService ],
})
export class AppModule {}
