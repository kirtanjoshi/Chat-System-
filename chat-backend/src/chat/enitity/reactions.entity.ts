/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity()
export class Reactions{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;

    @Column({ nullable: true })
    emotion: string;

    @ManyToOne(() => Chat, (messsage)=>messsage.reactions , {onDelete : 'CASCADE'})
    message: Chat;
}