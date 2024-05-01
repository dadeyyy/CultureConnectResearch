import express from 'express';
import { isAdmin, isAuthenticated, validate, } from '../middleware/middleware.js';
import { calendarSchema } from '../utils/Schemas.js';
import { db } from '../utils/db.server.js';
import * as dotenv from 'dotenv';
import Geocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import { catchAsync } from '../middleware/errorHandler.js';
import ExpressError from '../middleware/ExpressError.js';
const calendarRoute = express.Router();
<<<<<<< HEAD
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
const geocoder = Geocoding({ accessToken: process.env.MAPBOX_TOKEN });
calendarRoute.get('/province/:provinceId', catchAsync(async (req, res) => {
    const { provinceId } = req.params;
    const provinceWithCalendars = await db.province.findUnique({
        where: { name: provinceId },
        include: {
            calendars: {
                orderBy: {
                    startDate: 'asc', // Sorting by date in ascending order
=======
calendarRoute.get("/province/:provinceId", async (req, res) => {
    try {
        const provinceId = req.params.provinceId;
        const provinceWithCalendars = await db.province.findUnique({
            where: { name: provinceId },
            include: {
                calendars: {
                    where: { startDate: { gte: new Date() } },
                    orderBy: {
                        startDate: "asc", // Sorting by date in ascending order
                    },
>>>>>>> 6ad2b41808e07d053f46e78b43e6a8026ddc67cb
                },
            },
        },
    });
    if (!provinceWithCalendars) {
        throw new ExpressError('Province not found', 404);
    }
<<<<<<< HEAD
    return res.status(200).json(provinceWithCalendars);
}));
calendarRoute.post('/create-calendar', isAuthenticated, isAdmin, validate(calendarSchema), catchAsync(async (req, res) => {
    const data = req.body;
    const { municipality, provinceId, startDate, endDate, repeat } = data;
    const parsedStartDate = new Date(startDate);
    const geoData = await geocoder
        .forwardGeocode({
        query: `${municipality}, ${provinceId}`,
        limit: 1,
    })
        .send();
    const location = geoData.body.features[0].geometry;
    const newCalendar = await db.calendar.create({
        data: {
            ...data,
            provinceId: data.provinceId,
            location: location,
            startDate: parsedStartDate,
            repeat: repeat,
            endDate: endDate || null,
        },
    });
    if (newCalendar) {
=======
    catch (error) {
        console.error(error);
        return res.status(500).json({ error, message: "INTERNAL SERVER ERROR!!" });
    }
});
calendarRoute.post("/create-calendar", isAuthenticated, isAdmin, validate(calendarSchema), async (req, res) => {
    try {
        const data = req.body;
        const { municipality, provinceId } = data;
        const { startDate } = data;
        const { endDate } = data;
        const { repeat } = data;
        // const parsedStartDate = new Date(startDate);
        // const utcStartDate = new Date(
        //   parsedStartDate.getTime() + parsedStartDate.getTimezoneOffset() * 60000
        // );
        const geoData = await geocoder
            .forwardGeocode({
            query: `${municipality}, ${provinceId}`,
            limit: 1,
        })
            .send();
        const location = geoData.body.features[0].geometry;
        console.log(startDate);
        const newCalendar = await db.calendar.create({
            data: {
                ...data,
                provinceId: data.provinceId,
                location: location,
                startDate: startDate,
                repeat: repeat,
                endDate: endDate || null,
            },
        });
>>>>>>> 6ad2b41808e07d053f46e78b43e6a8026ddc67cb
        return res.status(200).json(newCalendar);
    }
    throw new ExpressError('Failed to create calendar', 400);
}));
calendarRoute.put('/update-calendar/:calendarId', isAuthenticated, isAdmin, validate(calendarSchema), catchAsync(async (req, res) => {
    const calendarId = parseInt(req.params.calendarId);
    const updatedData = req.body;
    const { startDate } = updatedData;
    const parsedDate = new Date(startDate);
    const existingCalendar = await db.calendar.findUnique({
        where: { id: calendarId },
    });
    if (!existingCalendar) {
        throw new ExpressError('Calendar not found', 404);
    }
    const updatedCalendar = await db.calendar.update({
        where: { id: calendarId },
        data: {
            ...updatedData,
            startDate: parsedDate,
        },
    });
    if (updatedCalendar) {
        return res.status(200).json(updatedCalendar);
    }
    throw new ExpressError('Failed to update calendar', 400);
}));
calendarRoute.delete('/delete-calendar/:calendarId', isAuthenticated, isAdmin, catchAsync(async (req, res) => {
    const calendarId = parseInt(req.params.calendarId);
    const existingCalendar = await db.calendar.findUnique({
        where: { id: calendarId },
    });
    if (!existingCalendar) {
        throw new ExpressError('Calendar not found', 404);
    }
    const deletedCalendar = await db.calendar.delete({
        where: { id: calendarId },
    });
    if (deletedCalendar) {
        return res.status(200).json({ message: 'Calendar deleted successfully' });
    }
    throw new ExpressError('Failed to delete calendar', 400);
}));
calendarRoute.get('/get-event/:eventId', isAuthenticated, catchAsync(async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const event = await db.calendar.findUnique({
        where: { id: eventId },
    });
    if (!event) {
        throw new ExpressError('Event not found', 404);
    }
    return res.status(200).json(event);
}));
// calendarRoute.post('/createprovince', async (req, res) => {
//   const provincesData = provinces.map((name) => ({ name }));
//   const result = await db.province.createMany({
//     data: provincesData,
//   });
//   console.log(result);
// });
calendarRoute.get('/locations', isAuthenticated, catchAsync(async (req, res) => {
    const calendars = await db.calendar.findMany({});
    // const locations = calendars.map((calendar) => calendar.location);
    if (calendars) {
        return res.status(200).json(calendars);
    }
    throw new ExpressError('No locations found!', 404);
}));
export default calendarRoute;
//# sourceMappingURL=calendarRoute.js.map