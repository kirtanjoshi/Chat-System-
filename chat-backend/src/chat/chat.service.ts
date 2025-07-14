    /* eslint-disable prettier/prettier */
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Chat } from 'src/typeorm/chat.entities';
    import { Repository } from 'typeorm';
    import { ChatDto } from './dto/chat.dto';

    @Injectable()
    export class ChatService {

        constructor(
            @InjectRepository(Chat)
            private messageRepo : Repository<Chat>   
        ) { }
        
        async createMessage(chatDto: ChatDto): Promise<Chat>  {
            const msg = this.messageRepo.create(chatDto);
            return this.messageRepo.save(msg);
        
        }

        async getMessageBetweenUser(userId1: number, userId2: number): Promise<Chat[]> {
            return await this.messageRepo.find({
                where: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 },
                ],
                order: { createdAt: 'ASC' },
            })
        }
    }
