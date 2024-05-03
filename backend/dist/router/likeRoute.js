import express from 'express';
import { isAuthenticated } from '../middleware/middleware.js';
import { db } from '../utils/db.server.js';
import { catchAsync } from '../middleware/errorHandler.js';
const likeRoute = express.Router();
// Route to like/unlike a regular post
likeRoute.post('/post/:postId/like', isAuthenticated, catchAsync(async (req, res) => {
    const userId = req.session.user?.id;
    const { postId } = req.params;
    const existingLike = await db.like.findFirst({
        where: {
            postId: +postId,
            userId: userId,
        },
    });
    if (existingLike) {
        // If like exists, delete it to unlike
        await db.like.delete({
            where: {
                id: existingLike.id,
            },
        });
        const notif = await db.notification.findFirst({
            where: {
                type: 'like',
                postId: +postId,
            }
        });
        console.log(notif);
        await db.notification.delete({
            where: {
                id: notif?.id
            }
        });
        const count = await db.like.count({
            where: {
                postId: +postId,
            },
        });
        return res.status(200).json({ message: 'Unliked successfully', count });
    }
    else {
        // If like does not exist, create a new like for the post
        await db.like.create({
            data: {
                userId: userId,
                postId: +postId,
                sharedId: null,
            },
        });
        const count = await db.like.count({
            where: {
                postId: +postId,
            },
        });
        return res.status(201).json({ message: 'Liked successfully', count });
    }
}));
// Route to get like status of a regular post
likeRoute.get('/post/:postId/like-status', isAuthenticated, catchAsync(async (req, res) => {
    const userId = req.session.user?.id;
    const { postId } = req.params;
    const existingLike = await db.like.findFirst({
        where: {
            postId: +postId,
            userId: userId,
        },
    });
    const isLiked = !!existingLike;
    const count = await db.like.count({
        where: {
            postId: +postId,
        },
    });
    return res.status(200).json({ isLiked, count });
}));
// Route to like/unlike a shared post
likeRoute.post('/shared/:sharedId/like', isAuthenticated, catchAsync(async (req, res) => {
    const userId = req.session.user?.id;
    const { sharedId } = req.params;
    const existingLike = await db.like.findFirst({
        where: {
            sharedId: +sharedId,
            userId: userId,
        },
    });
    if (existingLike) {
        // If like exists, delete it to unlike
        await db.like.delete({
            where: {
                id: existingLike.id,
            },
        });
        const notif = await db.notification.findFirst({
            where: {
                type: 'likeShared',
                postId: +sharedId,
            }
        });
        console.log(notif);
        await db.notification.delete({
            where: {
                id: notif?.id
            }
        });
        const count = await db.like.count({
            where: {
                sharedId: +sharedId,
            },
        });
        res.status(200).json({ message: 'Unliked successfully', count });
    }
    else {
        // If like does not exist, create a new like for the shared post
        await db.like.create({
            data: {
                userId: userId,
                sharedId: +sharedId,
                postId: null,
            },
        });
        const count = await db.like.count({
            where: {
                sharedId: +sharedId,
            },
        });
        res.status(201).json({ message: 'Liked successfully', count });
    }
}));
// Route to get like status of a shared post
likeRoute.get('/shared/:sharedId/like-status', isAuthenticated, catchAsync(async (req, res) => {
    const userId = req.session.user?.id;
    const { sharedId } = req.params;
    const existingLike = await db.like.findFirst({
        where: {
            sharedId: +sharedId,
            userId: userId,
        },
    });
    const isLiked = !!existingLike;
    const count = await db.like.count({
        where: {
            sharedId: +sharedId,
        },
    });
    res.status(200).json({ isLiked, count });
}));
export default likeRoute;
//# sourceMappingURL=likeRoute.js.map