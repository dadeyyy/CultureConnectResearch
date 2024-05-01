import express from 'express';
import { db } from '../utils/db.server.js';
import { isAuthenticated } from '../middleware/middleware.js';
import ExpressError from '../middleware/ExpressError.js';
import { catchAsync } from '../middleware/errorHandler.js';
const userRoute = express.Router();
//GET ALL USERS
userRoute.get('/allusers', isAuthenticated, catchAsync(async (req, res) => {
    const allusers = await db.user.findMany({});
    if (allusers) {
        return res.status(200).json(allusers);
    }
    throw new ExpressError('Users not found', 404);
}));
//GET USER BY ID
userRoute.get('/user/:userId', catchAsync(async (req, res) => {
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
    throw new ExpressError("Can't find user", 404);
}));
userRoute.get('/peoples', isAuthenticated, catchAsync(async (req, res) => {
    const userId = String(req.session.user?.id); // Convert userId to string
    console.log('userId', userId);
    const followingIds = await db.followers.findMany({
        where: {
            followerId: parseInt(userId),
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
    if (people) {
        return res.status(200).json({ people });
    }
}));
// userRoute.get('/Thingspeak', async(req,res)=>{
//   const response  = await fetch('https://api.thingspeak.com/channels/2531063/status.json?api_key=PMW7A3RMANH5IGQV');
//   const data = await response.json();
//   console.log(data);
// })
export default userRoute;
//# sourceMappingURL=userRoute.js.map