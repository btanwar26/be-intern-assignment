import { Router } from 'express';
import { PostController } from '../controllers/post.controller';

export const postRouter = Router();
const postController = new PostController();

// Get all posts
postRouter.get('/', postController.getAllPosts.bind(postController));

// Get post by id
postRouter.get('/:id', postController.getPostById.bind(postController));

// Create new post
postRouter.post('/', postController.createPost.bind(postController));

// Update post
postRouter.put('/:id', postController.updatePost.bind(postController));

// Delete post
postRouter.delete('/:id', postController.deletePost.bind(postController));
