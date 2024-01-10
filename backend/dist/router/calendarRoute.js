import express from 'express';
import { isAdmin, isAuthenticated, validate, } from '../middleware/middleware.js';
import { calendarSchema } from '../utils/Schemas.js';
import { db } from '../utils/db.server.js';
const calendarRoute = express.Router();
calendarRoute.get('/province/:provinceId', async (req, res) => {
    try {
        const provinceId = req.params.provinceId;
        const provinceWithCalendars = await db.province.findUnique({
            where: { name: provinceId },
            include: {
                calendars: true,
            },
        });
        if (!provinceWithCalendars) {
            return res.status(404).json({ message: 'Province not found' });
        }
        return res.status(200).json(provinceWithCalendars);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error, message: 'INTERNAL SERVER ERROR!!' });
    }
});
calendarRoute.post('/create-calendar', isAuthenticated, isAdmin, validate(calendarSchema), async (req, res) => {
    try {
        const data = req.body;
        const newCalendar = await db.calendar.create({
            data: data
        });
        return res.status(200).json(newCalendar);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error, message: "INTERNAL SERVER ERROR!!" });
    }
});
calendarRoute.put('/update-calendar/:calendarId', isAuthenticated, isAdmin, validate(calendarSchema), async (req, res) => {
    try {
        const calendarId = parseInt(req.params.calendarId);
        const updatedData = req.body;
        const existingCalendar = await db.calendar.findUnique({
            where: { id: calendarId },
        });
        if (!existingCalendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }
        const updatedCalendar = await db.calendar.update({
            where: { id: calendarId },
            data: updatedData,
        });
        return res.status(200).json(updatedCalendar);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error, message: 'INTERNAL SERVER ERROR!!' });
    }
});
calendarRoute.delete('/delete-calendar/:calendarId', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const calendarId = parseInt(req.params.calendarId);
        const existingCalendar = await db.calendar.findUnique({
            where: { id: calendarId },
        });
        if (!existingCalendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }
        await db.calendar.delete({
            where: { id: calendarId },
        });
        return res.status(200).json({ message: 'Calendar deleted successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error, message: 'INTERNAL SERVER ERROR!!' });
    }
});
export default calendarRoute;
//# sourceMappingURL=calendarRoute.js.map