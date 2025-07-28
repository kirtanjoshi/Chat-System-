/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
export class ChatDto {
  @ApiProperty({ example: 1, description: 'ID of the sender' })
  @IsNotEmpty()
  senderId: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the sender',
    required: false,
  })
  @IsNotEmpty()
  senderEmail?: string;

  @IsNotEmpty()
  senderProfilePic?: string;

  @ApiProperty({ example: 'Hello!', description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'image.png',
    description: 'Image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    example: 10,
    description: 'ID of the message being replied to',
    required: false,
  })
  @IsOptional()
  replyToMessageId?: number;

  @ApiProperty({ example: 5, description: 'ID of the chat room' })
  @IsNotEmpty()
  roomId: number;
}
