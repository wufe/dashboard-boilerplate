import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import * as Moment from 'moment';

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    createdAt: string;

    @Column({
        nullable: true
    })
    updatedAt: string;
}