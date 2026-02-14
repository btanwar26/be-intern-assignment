import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';

export class FollowController {
    private followRepository = AppDataSource.getRepository(Follow);
    private userRepository = AppDataSource.getRepository(User);

    async followUser(req: Request, res: Response) {
        try {
            const { followerId, followingId } = req.body;

            if (followerId === followingId) {
                return res.status(400).json({ message: 'User cannot follow themselves' });
            }

            const follower = await this.userRepository.findOneBy({ id: followerId });
            const following = await this.userRepository.findOneBy({ id: followingId });

            if (!follower || !following) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if already following
            const existingFollow = await this.followRepository.findOne({
                where: {
                    follower: { id: followerId },
                    following: { id: followingId }
                }
            });

            if (existingFollow) {
                return res.status(400).json({ message: 'Already following this user' });
            }

            const follow = this.followRepository.create({
                follower,
                following
            });

            await this.followRepository.save(follow);
            res.status(201).json({ message: 'Followed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error following user', error });
        }
    }

    async unfollowUser(req: Request, res: Response) {
        try {
            const { followerId, followingId } = req.body;

            const follow = await this.followRepository.findOne({
                where: {
                    follower: { id: followerId },
                    following: { id: followingId }
                }
            });

            if (!follow) {
                return res.status(404).json({ message: 'Follow relationship not found' });
            }

            await this.followRepository.remove(follow);
            res.status(200).json({ message: 'Unfollowed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error unfollowing user', error });
        }
    }

    async getFollowers(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const followers = await this.followRepository.find({
                where: { following: { id: userId } },
                relations: ['follower']
            });
            res.json(followers.map(f => f.follower));
        } catch (error) {
            res.status(500).json({ message: 'Error fetching followers', error });
        }
    }

    async getFollowing(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const following = await this.followRepository.find({
                where: { follower: { id: userId } },
                relations: ['following']
            });
            res.json(following.map(f => f.following));
        } catch (error) {
            res.status(500).json({ message: 'Error fetching following', error });
        }
    }
}
