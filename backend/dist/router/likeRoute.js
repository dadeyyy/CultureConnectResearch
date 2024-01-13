import express from "express";
import { isAuthenticated } from "../middleware/middleware.js";
import { db } from "../utils/db.server.js";
const likeRoute = express.Router();
likeRoute.post("/post/:postId/like", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user?.id;
        const { postId } = req.params;
        const existingLike = await db.like.findFirst({
            where: {
                postId: +postId,
                userId: userId,
            },
        });
        if (existingLike) {
            await db.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            const count = await db.like.count({
                where: {
                    postId: +postId,
                },
            });
            res.status(200).json({ message: "Unliked successfully", count });
        }
        else {
            await db.like.create({
                data: {
                    postId: +postId,
                    userId: userId,
                },
            });
            const count = await db.like.count({
                where: {
                    postId: +postId,
                },
            });
            res.status(201).json({ message: "Liked successfully", count });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error, message: "INTERNAL SERVER ERROR!" });
    }
});
likeRoute.get("/post/:postId/like-status", isAuthenticated, async (req, res) => {
    try {
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
        res.status(200).json({ isLiked, count });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error, message: "INTERNAL SERVER ERROR!" });
    }
});
export default likeRoute;
//# sourceMappingURL=likeRoute.js.map