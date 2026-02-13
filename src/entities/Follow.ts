import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('follows')
export class Follow {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, (user) => user.followers)
    follower: User;

    @ManyToOne(() => User, (user) => user.following)
    following: User;

    @CreateDateColumn()
    createdAt: Date;
}
