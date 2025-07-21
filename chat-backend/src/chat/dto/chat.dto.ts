/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @IsNotEmpty()
  senderId: number;

  @IsNotEmpty()
  senderEmail?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  replyToMessageId?: number;

  @IsNotEmpty()
  roomId: number;
}
