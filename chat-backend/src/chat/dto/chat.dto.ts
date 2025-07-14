/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export class ChatDto{

    @IsNotEmpty()
    senderId: number;
    senderEmail: string;
    @IsNotEmpty()
    receiverEmail: string;

    receiverId: number;
    @IsString()
    content: string;

    @IsString()
    image: string;
    
    replyToMessageId: number;
}