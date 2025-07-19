/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatRoom } from './chatroom.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column({ nullable: true })
  senderEmail: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  replyToMessageId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ChatRoom, (room) => room.chat, { nullable: true })
  room: ChatRoom;
 

  @UpdateDateColumn()
  updatedAt: Date;

}
