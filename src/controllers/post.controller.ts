import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { Hashtag } from '../entities/Hashtag';

export class PostController {
    private postRepository = AppDataSource.getRepository(Post);
    private userRepository = AppDataSource.getRepository(User);
    private hashtagRepository = AppDataSource.getRepository(Hashtag);

    private async getHashtagsFromContent(content: string): Promise<Hashtag[]> {
        const hashtagRegex = /#\w+/g;
        const tags = content.match(hashtagRegex) || [];
        const uniqueTags = [...new Set(tags.map(tag => tag.slice(1)))]; 

        const hashtags: Hashtag[] = [];
        for (const tagText of uniqueTags) {
            let hashtag = await this.hashtagRepository.findOneBy({ tag: tagText });
            if (!hashtag) {
                hashtag = this.hashtagRepository.create({ tag: tagText });
                await this.hashtagRepository.save(hashtag);
            }
            hashtags.push(hashtag);
        }
        return hashtags;
    }

    async createPost(req: Request, res: Response) {
        try {
            const { userId, content } = req.body;
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const hashtags = await this.getHashtagsFromContent(content);

            const post = this.postRepository.create({
                content,
                author: user,
                hashtags,
            });

            const result = await this.postRepository.save(post);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating post', error });
        }
    }

    async getAllPosts(req: Request, res: Response) {
        try {
            const posts = await this.postRepository.find({
                relations: ['author', 'hashtags', 'likes'],
                order: { createdAt: 'DESC' },
            });
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching posts', error });
        }
    }

    async getPostById(req: Request, res: Response) {
        try {
            const post = await this.postRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ['author', 'hashtags', 'likes', 'likes.user'],
            });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json(post);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching post', error });
        }
    }

    async updatePost(req: Request, res: Response) {
        try {
            const post = await this.postRepository.findOneBy({
                id: parseInt(req.params.id),
            });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (req.body.content) {
                post.content = req.body.content;
                post.hashtags = await this.getHashtagsFromContent(req.body.content);
            }

            const result = await this.postRepository.save(post);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error updating post', error });
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const result = await this.postRepository.delete(parseInt(req.params.id));
            if (result.affected === 0) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting post', error });
        }
    }
}
