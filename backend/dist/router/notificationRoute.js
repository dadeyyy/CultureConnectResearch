import express from 'express';
import { isAuthenticated } from '../middleware/middleware.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { db } from '../utils/db.server.js';
const notificationRoute = express.Router();
notificationRoute.get('/notifications/:id', isAuthenticated, catchAsync(async (req, res) => {
    const { id } = req.params;
    const notifications = await db.notification.findMany({
        where: {
            userId: +id
        }
    });
    console.log(notifications);
    res.json(notifications);
}));
export default notificationRoute;
//# sourceMappingURL=notificationRoute.js.map