import express from 'express';
import { db } from '../utils/db.server.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { Request, Response } from 'express';
import ExpressError from '../middleware/ExpressError.js';
import {
  isAuthenticated,
  isProvinceAdmin,
  validate,
} from '../middleware/middleware.js';
import { uploadHeritage } from '../utils/cloudinary.js';
import { heritageSchema, heritageTypeSchema } from '../utils/Schemas.js';
import Geocoding from '@mapbox/mapbox-sdk/services/geocoding.js';

const heritageRoute = express.Router();

const mapboxToken = process.env.MAPBOX_TOKEN;

const geocoder = Geocoding({ accessToken: mapboxToken as string });

type GeoJsonPoint = {
  type: 'Point';
  coordinates: number[];
};

heritageRoute.get(
  '/heritage',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const allHeritage = await db.heritage.findMany({});

    if (allHeritage) {
      return res.status(200).json(allHeritage);
    }

    throw new ExpressError('No heritage', 404);
  })
);

heritageRoute.post(
  '/heritage/:province',
  isAuthenticated,
  isProvinceAdmin,
  uploadHeritage.array('heritage'),
  validate(heritageSchema),
  catchAsync(async (req: Request, res: Response) => {
    const data: heritageTypeSchema = req.body;
    const files = req.files as Express.Multer.File[];
    const heritageFile = files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    const geoData = await geocoder
      .forwardGeocode({
        query: `${data.municipality}, ${req.session.user?.province ?? ''}`,
        limit: 1,
      })
      .send();

    const location: GeoJsonPoint = geoData.body.features[0].geometry;

    const newHeritage = await db.heritage.create({
      data: {
        ...data,
        province: req.session.user?.province || '',
        location: location,
        userId: req.session.user?.id,

        files: {
          create: heritageFile,
        },
      },
      include: {
        files: true,
        user: true,
      },
    });
    if (newHeritage) {
      return res.status(201).json({
        message: 'Successfully created new archive',
        data: newHeritage,
      });
    }

    throw new ExpressError('Error in creating heritage', 400);
  })
);

heritageRoute.delete(
  '/heritage/:province/:heritageId',
  isAuthenticated,
  isProvinceAdmin,
  catchAsync(async (req: Request, res: Response) => {
    const { heritageId } = req.params;

    const heritage = await db.heritage.findUnique({
      where: {
        id: +heritageId,
      },
      include: {
        user: true,
      },
    });

    if(!heritage){
        throw new ExpressError('No heritage', 404)
    }

    const deletedHeritage = await db.heritage.delete({
        where:{
            id: +heritageId
        }
    })

    if(deletedHeritage){
        return res.status(200).json({message: 'Heritage deleted succesfully'})
    }

    throw new ExpressError('Failed to delete heritage', 400)
  })
);

export default heritageRoute;
