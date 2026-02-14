import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Like } from '../entities/Like';
import { User } from '../entities/User';
import { Post } from '../entities/Post';

export class LikeController {
    private likeRepository = AppDataSource.getRepository(Like);
    private userRepository = AppDataSource.getRepository(User);
    private postRepository = AppDataSource.getRepository(Post);

    async likePost(req: Request, res: Response) {
        try {
            const { userId, postId } = req.body;

            const user = await this.userRepository.findOneBy({ id: userId });
            const post = await this.postRepository.findOneBy({ id: postId });

            if (!user || !post) {
                return res.status(404).json({ message: 'User or Post not found' });
            }

            const existingLike = await this.likeRepository.findOne({
                where: {
                    user: { id: userId },
                    post: { id: postId }
                }
            });

            if (existingLike) {
                return res.status(400).json({ message: 'User already liked this post' });
            }

            const like = this.likeRepository.create({
                user,
                post
            });

            await this.likeRepository.save(like);
            res.status(201).json({ message: 'Post liked successfully' });

        } catch (error) {
            res.status(500).json({ message: 'Error liking post', error });
        }
    }

    async unlikePost(req: Request, res: Response) {
        try {
            const { userId, postId } = req.body;

            const like = await this.likeRepository.findOne({
                where: {
                    user: { id: userId },
                    post: { id: postId }
                }
            });

            if (!like) {
                return res.status(404).json({ message: 'Like not found' });
            }

            await this.likeRepository.remove(like);
            res.status(200).json({ message: 'Post unliked successfully' });

        } catch (error) {
            res.status(500).json({ message: 'Error unliking post', error });
        }
    }
}
