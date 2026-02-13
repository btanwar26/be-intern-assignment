import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Hashtag } from './Hashtag';
import { Like } from './Like';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => User, (user) => user.posts)
    author: User;

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts)
    @JoinTable()
    hashtags: Hashtag[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
