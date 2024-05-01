import express from 'express';
import {
  isAdmin,
  isAuthenticated,
  validate,
} from '../middleware/middleware.js';
import { calendarSchema, calendarTypeSchema } from '../utils/Schemas.js';
import { db } from '../utils/db.server.js';
import { provinces } from './province.js';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

import Geocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import { catchAsync } from '../middleware/errorHandler.js';
import ExpressError from '../middleware/ExpressError.js';

const calendarRoute = express.Router();
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const geocoder = Geocoding({ accessToken: process.env.MAPBOX_TOKEN as string });

type GeoJsonPoint = {
  type: 'Point';
  coordinates: number[];
};

calendarRoute.get(
  '/province/:provinceId',
  catchAsync(async (req: Request, res: Response) => {
    const { provinceId } = req.params;
    const provinceWithCalendars = await db.province.findUnique({
      where: { name: provinceId },
      include: {
        calendars: {
          where: { startDate: { gte: new Date() } },
          orderBy: {
            startDate: 'asc', // Sorting by date in ascending order
          },
        },
      },
    });

    if (!provinceWithCalendars) {
      throw new ExpressError('Province not found', 404);
    }
    return res.status(200).json(provinceWithCalendars);
  })
);

calendarRoute.post(
  '/create-calendar',
  isAuthenticated,
  isAdmin,
  validate(calendarSchema),
  catchAsync(async (req: Request, res: Response) => {
    const data: calendarTypeSchema = req.body;
    const { municipality, provinceId, startDate, endDate, repeat } = data;
    const parsedStartDate = new Date(startDate);

    const geoData = await geocoder
      .forwardGeocode({
        query: `${municipality}, ${provinceId}`,
        limit: 1,
      })
      .send();

    const location: GeoJsonPoint = geoData.body.features[0].geometry;

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
      return res.status(200).json(newCalendar);
    }
    throw new ExpressError('Failed to create calendar', 400);
  })
);

calendarRoute.put(
  '/update-calendar/:calendarId',
  isAuthenticated,
  isAdmin,
  validate(calendarSchema),
  catchAsync(async (req: Request, res: Response) => {
    const calendarId = parseInt(req.params.calendarId);
    const updatedData: calendarTypeSchema = req.body;
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
  })
);

calendarRoute.delete(
  '/delete-calendar/:calendarId',
  isAuthenticated,
  isAdmin,
  catchAsync(async (req: Request, res: Response) => {
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
  })
);

calendarRoute.get(
  '/get-event/:eventId',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.eventId);
    const event = await db.calendar.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new ExpressError('Event not found', 404);
    }

    return res.status(200).json(event);
  })
);

// calendarRoute.post('/createprovince', async (req, res) => {
//   const provincesData = provinces.map((name) => ({ name }));

//   const result = await db.province.createMany({
//     data: provincesData,
//   });

//   console.log(result);
// });

calendarRoute.get('/locations', isAuthenticated,catchAsync( async (req:Request, res:Response) => {

  const calendars = await db.calendar.findMany({});
  // const locations = calendars.map((calendar) => calendar.location);

  if (calendars) {
    return res.status(200).json(calendars);
  }
  throw new ExpressError('No locations found!', 404);
}))

export default calendarRoute;
