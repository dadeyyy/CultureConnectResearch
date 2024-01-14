import express from 'express';
import { db } from '../utils/db.server.js';
import { isAuthenticated } from '../middleware/middleware.js';
import { mostLikedProvince } from '../utils/mostLikedProvince.js';
const algoRoute = express.Router();
algoRoute.get('/algorithm', isAuthenticated, async (req, res) => {
    try {
        const currentUser = req.session.user?.id;
        // Find user
        const userLikes = await db.user.findUnique({
            where: {
                id: currentUser,
            },
            include: {
                likes: true,
            },
        });
        if (!userLikes) {
            // If user data is not found, send a 404 Not Found response
            return res.status(404).json({ error: 'User not found' });
        }
        // Get all postId
        const userLikesId = userLikes.likes.map((userLike) => userLike.postId);
        if (userLikesId.length === 0) {
            // If the user has no liked posts, send a 204 No Content response
            return res.status(204).json({ message: 'No liked posts found for the user' });
        }
        const userPostProvinces = await db.post.findMany({
            where: {
                id: {
                    in: userLikesId,
                },
            },
        });
        const provinces = userPostProvinces.map((post) => post.province);
        const mostLikedProvinces = mostLikedProvince(provinces);
        const suggestedPosts = await db.post.findMany({
            where: {
                province: {
                    in: mostLikedProvinces.mostOccurringElements,
                },
                id: {
                    notIn: userLikesId,
                },
            },
            orderBy: {
                likes: {
                    _count: 'desc',
                },
            },
            take: 10,
        });
        console.log(suggestedPosts);
        res.status(200).json({ data: suggestedPosts });
    }
    catch (error) {
        console.error('Error in algorithm route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default algoRoute;
//# sourceMappingURL=algoRoute.js.map