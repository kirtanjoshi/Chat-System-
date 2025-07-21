/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiResponse } from '@nestjs/swagger';
import { storage } from "./cloudinay/cloudinary.storage";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateGroupDto } from "./dto/room-participants";
import { ChatService } from "./chat.service";


@Controller('chat')
export class ChatController {
  @Post('upload-image')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'No file uploaded.' })
  @UseInterceptors(FileInterceptor('image', { storage }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        return { error: 'No file uploaded' };
      }
      return {
        url: file.path,
      };
    } catch (e) {
      console.log(e);
    }
  }

  constructor(private readonly chatService: ChatService) {}

    @Post("/create")
    @ApiResponse({ status: 201, description: 'Group created successfully.' })
    // eslint-disable-next-line @typescript-eslint/require-await
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
  @Get(':id/participants')
  @ApiResponse({ status: 200, description: 'Participants of the group.' })
  @Post(':roomId/leave/:userId')
  @ApiResponse({ status: 200, description: 'User left the group.' })
  async leaveGroup(@Param('roomId') roomId: number, @Param('userId') userId: number) {
    return this.chatService.removeUserFromGroup(roomId, userId);
  }
  // async getParticipants(@Param('id') id: number) {
  //   return this.chatService.getParticipants(id);
  // }
}