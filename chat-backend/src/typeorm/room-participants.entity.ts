/* eslint-disable prettier/prettier */
import {  Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoom } from "./chatroom.entity";
import { User } from "./auth.typeorm";


@Entity()
export class ChatRoomParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;
  @ManyToOne(() => ChatRoom, (room) => room.participants )
  @JoinColumn({ name: 'roomId' })
  room: ChatRoom;

}