/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chat/enitity/chat.entity';
import { ChatController } from './chat.contoller';
// import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { configureCloudinary } from './cloudinay/cloudinary.config';
import { MetadataController } from './metadata.controller';
import { ChatRoom } from 'src/chat/enitity/chatroom.entity';
import { ChatRoomParticipant } from 'src/chat/enitity/room-participants.entity';
import { User } from 'src/auth/entity/auth.entity';
configureCloudinary();
@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatRoom, ChatRoomParticipant, User]),
    //
    MulterModule.register({}), /// used for file interceptor
  ],
  controllers: [ChatController, MetadataController],

  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
