import express from "express";
import { db } from "../utils/db.server.js";
import { isAuthenticated } from "../middleware/middleware.js";
const userRoute = express.Router();
//GET ALL USERS
userRoute.get("/allusers", isAuthenticated, async (req, res) => {
    const allusers = await db.user.findMany({});
    console.log(allusers);
    res.json(allusers);
});
//GET USER BY ID
userRoute.get("/user/:userId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                posts: true,
            },
        });
        if (user) {
            return res.status(200).json({
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    province: user.province,
                    imageUrl: user.avatarUrl,
                    bio: user.bio,
                },
            });
        }
        return res.status(404).json({ error: "Can't find user" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
userRoute.get("/peoples", async (req, res) => {
    try {
        const userId = String(req.session.user?.id); // Convert userId to string
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        console.log("Received userId:", userId);
        const followingIds = await db.followers.findMany({
            where: {
                followerId: parseInt(userId), // ParseInt expects string input
            },
            select: {
                followingId: true,
            },
        });
        const followingIdsArray = followingIds.map((entry) => entry.followingId);
        const people = await db.user.findMany({
            where: {
                NOT: [{ id: { in: followingIdsArray } }, { id: parseInt(userId) }],
            },
            take: 10,
        });
        res.status(200).json({ people });
    }
    catch (error) {
        console.error("Error in /peoples route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default userRoute;
//# sourceMappingURL=userRoute.js.map