import express from "express";
import { isAdmin, isAuthenticated, validate } from "../middleware/middleware.js";
import { calendarSchema } from "../utils/Schemas.js";
import { db } from "../utils/db.server.js";
import { provinces } from "./province.js";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const mapboxToken = "pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA";
const geocoder = Geocoding({ accessToken: mapboxToken });
const calendarRoute = express.Router();
calendarRoute.get("/province/:provinceId", async (req, res) => {
    try {
        const provinceId = req.params.provinceId;
        const provinceWithCalendars = await db.province.findUnique({
            where: { name: provinceId },
            include: {
                calendars: {
                    orderBy: {
                        startDate: "asc", // Sorting by date in ascending order
                    },
                },
            },
        });
        if (!provinceWithCalendars) {
            return res.status(404).json({ message: "Province not found" });
        }
        return res.status(200).json(provinceWithCalendars);
    }
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
        return res.status(200).json(newCalendar);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error, message: "INTERNAL SERVER ERROR!!" });
    }
});
// calendarRoute.put(
//   '/update-calendar/:calendarId',
//   isAuthenticated,
//   isAdmin,
//   validate(calendarSchema),
//   async (req, res) => {
//     try {
//       const calendarId = parseInt(req.params.calendarId);
//       const updatedData: calendarTypeSchema = req.body;
//       const { date } = updatedData;
//       const parsedDate = new Date(date);
//       const existingCalendar = await db.calendar.findUnique({
//         where: { id: calendarId },
//       });
//       if (!existingCalendar) {
//         return res.status(404).json({ message: 'Calendar not found' });
//       }
//       const updatedCalendar = await db.calendar.update({
//         where: { id: calendarId },
//         data: {
//           ...updatedData,
//           date: parsedDate,
//         },
//       });
//       return res.status(200).json(updatedCalendar);
//     } catch (error) {
//       console.error(error);
//       return res
//         .status(500)
//         .json({ error, message: 'INTERNAL SERVER ERROR!!' });
//     }
//   }
// );
calendarRoute.delete("/delete-calendar/:calendarId", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const calendarId = parseInt(req.params.calendarId);
        const existingCalendar = await db.calendar.findUnique({
            where: { id: calendarId },
        });
        if (!existingCalendar) {
            return res.status(404).json({ message: "Calendar not found" });
        }
        await db.calendar.delete({
            where: { id: calendarId },
        });
        return res.status(200).json({ message: "Calendar deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error, message: "INTERNAL SERVER ERROR!!" });
    }
});
calendarRoute.get("/get-event/:eventId", async (req, res) => {
    try {
        const eventId = parseInt(req.params.eventId);
        const event = await db.calendar.findUnique({
            where: { id: eventId },
        });
        console.log(event);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json(event);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error, message: "INTERNAL SERVER ERROR!!" });
    }
});
calendarRoute.post("/createprovince", async (req, res) => {
    const provincesData = provinces.map((name) => ({ name }));
    const result = await db.province.createMany({
        data: provincesData,
    });
    console.log(result);
});
calendarRoute.get("/locations", isAuthenticated, async (req, res) => {
    const calendars = await db.calendar.findMany({});
    // const locations = calendars.map((calendar) => calendar.location);
    if (calendars) {
        return res.status(200).json(calendars);
    }
    return res.status(404).json({ error: "No locations found!" });
});
export default calendarRoute;
//# sourceMappingURL=calendarRoute.js.map