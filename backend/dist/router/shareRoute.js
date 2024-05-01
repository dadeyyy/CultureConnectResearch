import express from 'express';
import { isAuthenticated, } from '../middleware/middleware.js';
import { db } from '../utils/db.server.js';
import ExpressError from '../middleware/ExpressError.js';
import { catchAsync } from '../middleware/errorHandler.js';
const shareRoute = express.Router();
// GET SPECIFIC SHARED POST
shareRoute.get('/shared-post/:id', isAuthenticated, catchAsync(async (req, res) => {
    // Get parameter ID
    const sharedId = parseInt(req.params.id);
    // Find post in the database
    const sharedPost = await db.sharedPost.findUnique({
        where: {
            id: sharedId,
        },
        include: {
            user: {
                select: {
                    avatarUrl: true,
                    createdAt: true,
                    firstName: true,
                    id: true,
                    lastName: true,
                    role: true,
                    username: true,
                    province: true,
                },
            },
            post: {
                include: {
                    photos: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                            province: true,
                            role: true,
                        },
                    },
                },
            },
        },
    });
    // If post is found, return post
    if (sharedPost) {
        return res.status(200).json(sharedPost);
    }
    // If not, return not found
    throw new ExpressError('Post not found', 404);
}));
// Share a post
shareRoute.post('/post/share/:postId', isAuthenticated, catchAsync(async (req, res) => {
    const postId = parseInt(req.params.postId);
    const userId = req.session.user?.id;
    const data = req.body;
    if (!userId) {
        throw new ExpressError('User not authenticated', 401);
    }
    const postToShare = await db.post.findUnique({
        where: {
            id: postId,
        },
        include: {
            photos: true,
            user: true,
            comments: true,
        },
    });
    if (!postToShare) {
        throw new ExpressError('Post not found', 404);
    }
    // Create a new shared post entry
    const sharedPost = await db.sharedPost.create({
        data: {
            caption: data.caption,
            postId: postToShare.id,
            userId: userId,
        },
        include: {
            post: true,
            user: true,
        },
    });
    if (sharedPost) {
        return res
            .status(201)
            .json({ message: 'Post shared successfully', data: sharedPost });
    }
    throw new ExpressError('Failed to share post', 400);
}));
// Fetch shared posts
shareRoute.get('/post/shared', isAuthenticated, catchAsync(async (req, res) => {
    const limit = parseInt(req.query.limit) || 1;
    const offset = parseInt(req.query.offset) || 0;
    const sharedPosts = await db.sharedPost.findMany({
        include: {
            post: {
                include: {
                    photos: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            province: true,
                            avatarUrl: true,
                            interest: true,
                        },
                    },
                },
            },
        },
        take: limit,
        skip: offset,
        orderBy: {
            createdAt: 'desc',
        },
    });
    res.status(200).json(sharedPosts);
}));
// DELETE sharedpost
shareRoute.delete('/shared-post/:sharedId', isAuthenticated, catchAsync(async (req, res) => {
    const sharedId = parseInt(req.params.sharedId);
    // Find shared post to delete
    const sharedPost = await db.sharedPost.findUnique({
        where: {
            id: sharedId,
        },
    });
    if (!sharedPost) {
        throw new ExpressError("Can't find shared post", 404);
    }
    // Delete the shared post
    const deletedSharedPost = await db.sharedPost.delete({
        where: {
            id: sharedId,
        },
    });
    if (deletedSharedPost) {
        return res
            .status(200)
            .json({ message: `Successfully deleted shared post! #${sharedId}` });
    }
    throw new ExpressError('Failed to delete shared post', 400);
}));
// GET SPECIFIC SHARED POST
shareRoute.get('/get-shared-post/:userId', isAuthenticated, catchAsync(async (req, res) => {
    // Get parameter ID
    const userId = parseInt(req.params.userId);
    // Find post in the database
    const sharedPost = await db.sharedPost.findMany({
        where: {
            userId: userId,
        },
        include: {
            user: {
                select: {
                    avatarUrl: true,
                    createdAt: true,
                    firstName: true,
                    id: true,
                    lastName: true,
                    role: true,
                    username: true,
                    province: true,
                },
            },
            post: {
                include: {
                    photos: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
        },
    });
    // If post is found, return post
    if (sharedPost) {
        return res.status(200).json(sharedPost);
    }
    // If not, return not found
    throw new ExpressError('Post not found', 404);
}));
export default shareRoute;
//# sourceMappingURL=shareRoute.js.map