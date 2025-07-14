/* eslint-disable prettier/prettier */
import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './auth/dto/mail.service';
import { ChatModule } from './chat/chat.module';
import { LinkPreviewService } from './link-preview/link-preview.service';
import { LinkPreviewController } from './link-preview/link-preview.controller';
import { MetadataController } from './chat/metadata.controller';
  

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
      entities: [__dirname + '/../typeorm/*.entity.{js,ts}'],
      synchronize: true,
      autoLoadEntities:true,
    }),
    AuthModule,
    ChatModule,

  ],
  controllers: [AppController, LinkPreviewController,MetadataController],
  providers: [AppService
    , MailService, LinkPreviewService
  ],
})
export class AppModule {}
