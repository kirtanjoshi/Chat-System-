/* eslint-disable @typescript-eslint/require-await,@typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { FileInterceptor } from "@nestjs/platform-express";

import { ChatService } from "./chat.service";
import { storage } from './cloudinay/cloudianary.storage';
import { CreateGroupDto } from './dto/room-participants.dto';
import { FastifyRequest } from 'fastify';

import { createWriteStream } from 'fs';
import { join } from 'path';

import { Readable } from 'stream';
import { configureCloudinary } from './cloudinay/cloudinary.config'; // update path as needed

const cloudinary = configureCloudinary();

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // @Post('/upload-image')
  // @ApiResponse({ status: 201, description: 'Image uploaded successfully.' })
  // @ApiResponse({ status: 400, description: 'No file uploaded.' })
  // @UseInterceptors(FileInterceptor('image', { storage }))
  // uploadImage(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     return { error: 'No file uploaded' };
  //   }
  //   return {
  //     url: file.path,
  //   };
  // }

  @Post('/upload-image')
  async uploadImage(@Req() req: FastifyRequest): Promise<any> {
    try {
      const part = await req.file(); // for Fastify file upload

      if (!part) {
        return { error: 'No file uploaded.' };
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'chat_images',
            public_id: `${Date.now()}-${part.filename}`,
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        part.file.pipe(uploadStream); // ✅ this is correct
      });

      return {
        message: 'Image uploaded to Cloudinary successfully.',
        result: uploadResult,
      };
    } catch (error) {
      console.error('Image Upload Failed:', error);
      return {
        error: 'Image upload failed.',
        details: error?.message || error,
      };
    }
  }




  @Post("/create")
  @ApiResponse({ status: 201, description: 'Group created successfully.' })
  async createGroup(@Body() dto: CreateGroupDto) {
    return this.chatService.createGroup(dto);
  }

  @Get("/groups")
  @ApiResponse({ status: 200, description: 'List of groups.' })
  async getGroups() {
    return this.chatService.getGroups();
  }

  @Get(':id/messages')
  @ApiResponse({ status: 200, description: 'Messages for the group.' })
  async getMessages(@Param('id') id: number) {
    return this.chatService.getMessages(id);
  }

  @Get('user/:userId/groups')
  @ApiResponse({ status: 200, description: 'Groups for the user.' })
  async getUserGroups(@Param('userId') userId: number) {
    return this.chatService.getGroupsForUser(userId);
  }

  @Post(':roomId/add-user/:userId')
  @ApiResponse({ status: 200, description: 'User added to group.' })
  async addUserToGroup(@Param('roomId') roomId: number, @Param('userId') userId: number) {
    return this.chatService.addUserToGroup(roomId, userId);
  }

  @Post(':roomId/leave/:userId')
  @ApiResponse({ status: 200, description: 'User left the group.' })
  async leaveGroup(@Param('roomId') roomId: number, @Param('userId') userId: number) {
    return this.chatService.removeUserFromGroup(roomId, userId);
  }

  @Get(':id/participants')
  @ApiResponse({ status: 200, description: 'Participants of the group.' })
  async getParticipants(@Param('id') id: number) {
    return this.chatService.getParticipants(id);
  }
}
