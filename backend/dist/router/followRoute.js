import express from 'express';
import { db } from '../utils/db.server.js';
import { catchAsync } from '../middleware/errorHandler.js';
import ExpressError from '../middleware/ExpressError.js';
import { isAuthenticated } from '../middleware/middleware.js';
const followRouter = express.Router();
followRouter.post('/follow', isAuthenticated, catchAsync(async (req, res) => {
    const { followerId, followingId } = req.body;
    const follow = await db.followers.create({
        data: {
            followerId: parseInt(followerId),
            followingId: parseInt(followingId),
        },
    });
    if (follow) {
        return res.status(200).json({ message: 'Successfully followed user' });
    }
    throw new ExpressError('Failed to follow user', 400);
}));
followRouter.delete('/unfollow/:userId', isAuthenticated, catchAsync(async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.body.currentUser; // Retrieve current user's ID
    const unfollow = await db.followers.deleteMany({
        where: {
            followerId: parseInt(currentUser),
            followingId: parseInt(userId),
        },
    });
    if (unfollow) {
        return res.status(200).json({ message: 'Successfully unfollowed user' });
    }
    throw new ExpressError('Failed to unfollow user', 400);
}));
followRouter.get('/is-following/:userId', isAuthenticated, catchAsync(async (req, res) => {
    const { userId } = req.params;
    const currentUser = req.session.user?.id; // Access current user's ID from session
    const isFollowing = await db.followers.findFirst({
        where: {
            followerId: currentUser,
            followingId: parseInt(userId),
        },
    });
    return res.status(200).json({ isFollowing: !!isFollowing });
}));
followRouter.get('/following-count/:userId', isAuthenticated, catchAsync(async (req, res) => {
    const { userId } = req.params;
    const followingCount = await db.followers.count({
        where: {
            followerId: parseInt(userId),
        },
    });
    return res.status(200).json({ followingCount });
}));
followRouter.get('/followers-count/:userId', isAuthenticated, catchAsync(async (req, res) => {
    const { userId } = req.params;
    const followersCount = await db.followers.count({
        where: {
            followingId: parseInt(userId),
        },
    });
    return res.status(200).json({ followersCount });
}));
export default followRouter;
//# sourceMappingURL=followRoute.js.map