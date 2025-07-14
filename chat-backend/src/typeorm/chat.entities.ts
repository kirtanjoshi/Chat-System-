/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()

export class Chat{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    receiverId: number;
    
    @Column()
    senderId: number;

    @Column({ nullable: true })
    senderEmail: string;
    
    @Column({ nullable: true })
    receiverEmail: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    replyToMessageId :number
    
    @CreateDateColumn()
    createdAt : Date

}