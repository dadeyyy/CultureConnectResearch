import express from 'express';
import { db } from '../utils/db.server.js';
import { isAuthenticated } from '../middleware/middleware.js';
const userRoute = express.Router();
//GET ALL USERS
userRoute.get('/allusers', isAuthenticated, async (req, res) => {
    const allusers = await db.user.findMany({});
    console.log(allusers);
    res.json(allusers);
});
//GET USER BY ID
userRoute.get('/user/:userId', isAuthenticated, async (req, res) => {
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
            return res.status(200).json({ user: user });
        }
        return res.status(404).json({ error: "Can't find user" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default userRoute;
//# sourceMappingURL=userRoute.js.map