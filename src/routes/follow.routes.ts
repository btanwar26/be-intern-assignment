import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller';

export const followRouter = Router();
const followController = new FollowController();

// Follow/Unfollow
followRouter.post('/follow', followController.followUser.bind(followController));
followRouter.post('/unfollow', followController.unfollowUser.bind(followController));

// Get followers/following
followRouter.get('/users/:id/followers', followController.getFollowers.bind(followController));
followRouter.get('/users/:id/following', followController.getFollowing.bind(followController));
