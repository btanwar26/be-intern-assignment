import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';

export const likeRouter = Router();
const likeController = new LikeController();

// Like post
likeRouter.post('/', likeController.likePost.bind(likeController));

// Unlike post
likeRouter.delete('/', likeController.unlikePost.bind(likeController));
