import express from 'express';
import { isAdmin, isAuthenticated, validate, } from '../middleware/middleware.js';
import { calendarSchema } from '../utils/Schemas.js';
import { db } from '../utils/db.server.js';
const calendarRoute = express.Router();
calendarRoute.post('/create-calendar', isAuthenticated, isAdmin, validate(calendarSchema), async (req, res) => {
    const data = req.body;
    const newCalendar = await db.
    ;
});
export default calendarRoute;
//# sourceMappingURL=calendarRoute.js.map