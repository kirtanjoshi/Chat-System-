/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from './auth.typeorm';
import { ChatRoomParticipant } from './room-participants.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

 

  @Column({ default: false })
  isGroup: boolean;

  @OneToMany(() => Chat, (chat) => chat.room)
  chat: Chat[];

  @ManyToOne(() => User, { eager: true })
  creator: User;

  @OneToMany(() => ChatRoomParticipant, (particpants) => particpants.room)
  participants: ChatRoomParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
