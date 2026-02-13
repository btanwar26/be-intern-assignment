import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn } from 'typeorm';
import { Post } from './Post';

@Entity('hashtags')
export class Hashtag {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    tag: string;

    @ManyToMany(() => Post, (post: Post) => post.hashtags)
    posts: Post[];

    @CreateDateColumn()
    createdAt: Date;
}
