/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Chat } from 'src/typeorm/chat.entity';
import { ChatRoom } from 'src/typeorm/chatroom.entity';
import { ChatRoomParticipant } from 'src/typeorm/room-participants.entity';
import { User } from 'src/typeorm/auth.typeorm';

import { ChatDto } from './dto/chat.dto';
import { CreateGroupDto } from './dto/room-participants';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    @InjectRepository(ChatRoom) private roomRepo: Repository<ChatRoom>,
    @InjectRepository(ChatRoomParticipant)
    private gpRepo: Repository<ChatRoomParticipant>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) { }

  //  Group message creation or 1-1 based on payload.roomId
  async createMessage(dto: ChatDto): Promise<Chat> {
    try {
      const msg = this.chatRepo.create({
        content: dto.content,
        senderId: dto.senderId,
        senderEmail: dto.senderEmail,
        image: dto.image,
        replyToMessageId: dto.replyToMessageId,
        room: { id: dto.roomId },
      });
      return await this.chatRepo.save(msg);
    }
    catch (e) {
      console.error('Error creating message:', e);
      throw new Error('Failed to create message');
    }
  }

  async getOrCreatePrivateRoom(
    userId1: number,
    userId2: number,
  ): Promise<ChatRoom> {
    try {
      const rooms = await this.roomRepo
        .createQueryBuilder('room') // Start query in th room table or opening a search session
        .leftJoinAndSelect('room.participants', 'participant') //  Provide the list of partiipants
        .leftJoinAndSelect('participant.user', 'user') // Provide the list of users
        .where('room.isGroup = :isGroup', { isGroup: false }) // Filter false group
        .getMany(); // Get all matching rooms list

      console.log('Rooms List :', rooms);

      // Fetch usernames for a meaningful name

      const user2 = await this.userRepo.findOneBy({ id: userId2 });

      for (const room of rooms) {
        const participantIds = room.participants.map((p) => p.user.id).sort();
        if (
          participantIds.length === 2 &&
          participantIds.includes(userId1) &&
          participantIds.includes(userId2)
        ) {
          return room;
        }
      }

      // No room found, so create one
      const newRoom = this.roomRepo.create({
        isGroup: false,
        name: `${user2!.email}`,
      });
      const savedRoom = await this.roomRepo.save(newRoom);

      console.log('Saved Rooms :', savedRoom);

      await this.gpRepo.save([
        this.gpRepo.create({ room: savedRoom, user: { id: userId1 } }),
        this.gpRepo.create({ room: savedRoom, user: { id: userId2 } }),
      ]);

      return savedRoom;
    } catch (error) {
      console.error('Error getting or creating private room:', error);
      throw new Error('Failed to get or create private room');
      
    }
  }

  //  Group-specific chat history
  async getMessages(roomId: number): Promise<Chat[]> {
    return this.chatRepo.find({
      where: { room: { id: roomId } },
      order: { createdAt: 'ASC' },
    });
  }
    
  async getMessageBetweenUser(userId1: number, userId2: number): Promise<Chat[]> {
    const room = await this.getOrCreatePrivateRoom(userId1, userId2);
    try {
      return this.chatRepo.find({
        where: { room: { id: room.id } },
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      console.error('Error getting messages between users:', error);
      throw new Error('Failed to get messages between users');
    
    }
  }


  //  Create a new group and attach participants
  async createGroup(dto: CreateGroupDto): Promise<ChatRoom> {
    const creator = await this.userRepo.findOneBy({ id: dto.creatorId });
    try {
      if (!creator) throw new Error(`User with ID ${dto.creatorId} not found`);

      const group = this.roomRepo.create({
        name: dto.name,
        creator,

        isGroup: true,
      });

      const savedGroup = await this.roomRepo.save(group);

      const participants = dto.participantIds.map((userId) =>
        this.gpRepo.create({ user: { id: userId }, room: savedGroup }),
      );
      await this.gpRepo.save(participants);

      return savedGroup;
    } catch (error) {
      throw new Error(`Failed to create group: ${error}`);
    }
  }

  //  Get all group chat rooms
  async getGroups(): Promise<ChatRoom[]> {
    try {
      return this.roomRepo.find({
        where: { isGroup: true },
        relations: ['participants', 'creator'],
      });
    } catch (error) {
      console.error('Error getting groups:', error);
      throw new Error('Failed to get groups');
      
    }
  }

  //  Get all groups a user is part of
  async getGroupsForUser(userId: number): Promise<ChatRoom[]> {
  
    try {
      const participantRooms = await this.gpRepo.find({
        where: { user: { id: userId } },
        relations: ['room'],
      });
   
      return participantRooms.map((p) => p.room);
    } catch (error) {
      console.error('Error getting groups for user:', error);
      throw new Error('Failed to get groups for user');
      
    }
  }

  // //  Get users participating in a room
  // async getParticipants(roomId: number): Promise<User[]> {
  //   const parts = await this.gpRepo.find({
  //     where: { room: { id: roomId } },
  //     relations: ['user'],
  //   });
  //   return parts.map((p) => p.user);
  // }

  //  Add user to a group
  async addUserToGroup(
    roomId: number,
    userId: number,
  ): Promise<ChatRoomParticipant> {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      const room = await this.roomRepo.findOneBy({ id: roomId });
      if (!user || !room) throw new Error('User or Room not found');
      const participant = this.gpRepo.create({ user, room });
      return await this.gpRepo.save(participant);
    } catch (error) {
      console.error('Error adding user to group:', error);
      throw new Error('Failed to add user to group');
      
    }
  }

  // Remove user from a group
  async removeUserFromGroup(
    roomId: number,
    userId: number,
  ): Promise<{ success: boolean }> {
    try {
      const participant = await this.gpRepo.findOne({
        where: { user: { id: userId }, room: { id: roomId } },
      });
      if (!participant) throw new Error('Participant not found');
      await this.gpRepo.remove(participant);
      return { success: true };
  
    } catch (error) {
      throw new Error(`Failed to remove user from group: ${error}`);
    }
  }
}