import express from "express";
import { db } from "../utils/db.server.js";
import { isAuthenticated } from "../middleware/middleware.js";
import { mostLikedProvince } from "../utils/mostLikedProvince.js";
const algoRoute = express.Router();
algoRoute.get("/algorithm", isAuthenticated, async (req, res) => {
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
            return res.status(404).json({ error: "User not found" });
        }
        // Get all postId
        const userLikesId = userLikes.likes.map((userLike) => userLike.postId);
        // Filter out null values from userLikesId
        const filteredUserLikesId = userLikesId.filter((id) => id !== null);
        if (filteredUserLikesId.length === 0) {
            return res.status(204).json({ message: "No liked posts found for the user" });
        }
        const userPostProvinces = await db.post.findMany({
            where: {
                id: {
                    in: filteredUserLikesId,
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
                    notIn: filteredUserLikesId,
                },
                userId: {
                    not: currentUser,
                },
            },
            orderBy: {
                likes: {
                    _count: "desc",
                },
            },
            take: 10,
            include: {
                user: true,
                photos: true,
            },
        });
        res.status(200).json(suggestedPosts);
    }
    catch (error) {
        console.error("Error in algorithm route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default algoRoute;
//# sourceMappingURL=algoRoute.js.map