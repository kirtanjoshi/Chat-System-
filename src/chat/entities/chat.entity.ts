/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatRoom } from './chatroom.entity';
import { Reactions } from './reactions.entity';


export enum MesssageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
}


@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  senderId: number;

  @Column({ nullable: true })
  senderEmail: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: MesssageType,
    default: MesssageType.TEXT,
  })
  type: MesssageType;

  @Column({ nullable: true })
  replyToMessageId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ChatRoom, (room) => room.chat, { nullable: true })
  room: ChatRoom;

  @Column({ nullable: true })
  mediaUrl: string;

  @Column('simple-array', { nullable: true })
  mentions: number[]; // store userIds as [1,2,3]

  @OneToMany(() => Reactions, (reaction) => reaction.message)
  reactions: Reactions[];

  @UpdateDateColumn()
  updatedAt: Date;
}
