/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() 

export class ResetPassword{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ nullable: true })
    resetToken: string;
    
    @Column({ nullable: true, type: 'timestamp' })
    resetTokenExpiry: Date;
}