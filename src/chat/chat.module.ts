/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatRoom } from './entities/chatroom.entity';
import { ChatRoomParticipant } from './entities/chatroom_participants';
import { User } from 'src/auth/entities/auth.entity';
import { Reactions } from './entities/reactions.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ChatController } from './chat.controller';
import { MetadataController } from './metadata.controller';

// import { ConfigModule } from '@nestjs/config';
// import { MulterModule } from '@nestjs/platform-express';
// import { configureCloudinary } from './cloudinay/cloudinary.config';


// configureCloudinary();

@Module({
  // controllers: [ MetadataController],
  imports: [
    TypeOrmModule.forFeature([
      Chat,
      ChatRoom,
      ChatRoomParticipant,
      User,
      Reactions,
    ]),
    //
    MulterModule.register({}), /// used for file interceptor
  ],
  controllers: [ChatController, MetadataController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
