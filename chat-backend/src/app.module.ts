/* eslint-disable prettier/prettier */
import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './auth/dto/mail.service';
import { ChatModule } from './chat/chat.module';

import { MetadataController } from './chat/metadata.controller';
import { HealthModule } from './health/health.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';
import { FirebaseAuthError } from 'firebase-admin/lib/utils/error';
import { FirebaseAdminController } from './firebase-admin/firebase-admin.controller';
import { FirebaseAdminService } from './firebase-admin/firebase-admin.service';


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
      database: 'chatsystem_db',
      // entities: [__dirname + '/../typeorm/*.entity.{js,ts}'],
      // entities: [__dirname + '/typeorm/*.entity.{ts,js}'],

      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    ChatModule,
    HealthModule,
    FirebaseAdminModule,
  ],
  controllers: [AppController, MetadataController, FirebaseAdminController],
  providers: [AppService, MailService, FirebaseAdminService],
})
export class AppModule {}
