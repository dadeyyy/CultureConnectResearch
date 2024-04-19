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
algoRoute.get("/search", async (req, res) => {
    const { query } = req.query;
    try {
        const searchResults = await db.$transaction([
            db.post.findMany({
                where: {
                    OR: [
                        { caption: { contains: query, mode: "insensitive" } },
                        { province: { contains: query, mode: "insensitive" } },
                        { municipality: { contains: query, mode: "insensitive" } },
                    ],
                },
                include: {
                    photos: true,
                    user: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            db.user.findMany({
                where: {
                    OR: [
                        { username: { contains: query, mode: "insensitive" } },
                        { firstName: { contains: query, mode: "insensitive" } },
                        { lastName: { contains: query, mode: "insensitive" } },
                    ],
                },
            }),
            db.archive.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                        { province: { contains: query, mode: "insensitive" } },
                        { municipality: { contains: query, mode: "insensitive" } },
                    ],
                },
            }),
            db.calendar.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { details: { contains: query, mode: "insensitive" } },
                        { municipality: { contains: query, mode: "insensitive" } },
                        { provinceId: { contains: query, mode: "insensitive" } },
                    ],
                },
            }),
        ]);
        res.json({
            posts: searchResults[0],
            users: searchResults[1],
            archives: searchResults[2],
            events: searchResults[3],
        });
    }
    catch (error) {
        console.error("Error in search route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default algoRoute;
//# sourceMappingURL=algoRoute.js.map