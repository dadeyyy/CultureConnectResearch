import express from 'express';
import { db } from '../utils/db.server.js';
import {
  isAuthenticated,
  isAdmin,
  isProvinceAdmin,
  validate,
} from '../middleware/middleware.js';
import { archiveSchema, archiveTypeSchema } from '../utils/Schemas.js';

import { cloudinary, upload, uploadArchive } from '../utils/cloudinary.js';
import { Multer } from 'multer';

import Geocoding from '@mapbox/mapbox-sdk/services/geocoding.js';

const mapboxToken =
  'pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA';

const geocoder = Geocoding({ accessToken: mapboxToken as string });

const archiveRoute = express.Router();

function generateRandomId() {
  return Math.floor(Math.random() * 90000) + 10000;
}

type GeoJsonPoint = {
  type: 'Point';
  coordinates: number[];
};

//Get specific archive
archiveRoute.get(
  '/archive/:province/:archiveId',
  isAuthenticated,
  async (req, res) => {
    try {
      const archiveId = parseInt(req.params.archiveId);
      const province = req.params.province;

      const archive = await db.archive.findUnique({
        where: {
          id: archiveId,
          province: province,
        },
        include: {
          files: true,
        },
      });

      if (!archive) {
        return res.status(404).json({ message: 'Archive not found' });
      }

      const extractedData = {
        id: archive.id,
        title: archive.title,
        description: archive.description,
        province: archive.province,
        municipality: archive.municipality,
        dateCreated: archive.createdAt,
        files: archive.files.map((file) => ({
          url: file.url,
          filename: file.filename,
        })),
        category: archive.category,
      };

      res.status(200).json({ data: extractedData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
);

//Viewing of archives;
archiveRoute.get('/archive/:province', isAuthenticated, async (req, res) => {
  try {
    const data = req.params.province;
    const provinceArchives = await db.archive.findMany({
      where: {
        province: data,
      },
      include: {
        files: true,
      },
    });
    if (provinceArchives) {
      const extractedData = provinceArchives.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        province: item.province,
        municipality: item.municipality,
        files: item.files.map((file) => ({
          url: file.url,
          filename: file.filename,
        })),
      }));

      return res.status(200).json({ data: extractedData });
    }

    return res.status(404).json({ message: 'No archives found!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

//Creation of archives
archiveRoute.post(
  '/archive/:province',
  isAuthenticated,
  isProvinceAdmin,
  uploadArchive.array('archive'),
  validate(archiveSchema),
  async (req, res) => {
    try {
      const data: archiveTypeSchema = req.body;
      const files = req.files as Express.Multer.File[];
      const archiveFile = files.map((file) => ({
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

      const newArchive = await db.archive.create({
        data: {
          ...data,
          province: req.session.user?.province ?? '',
          location: location,
          userId: req.session.user?.id,
          files: {
            create: archiveFile,
          },
        },
        include: {
          files: true,
          user: true,
        },
      });

      res.status(201).json({
        message: 'Successfully created new archive',
        data: newArchive,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Cannot create new archive', error });
    }
  }
);

// Edit archive
archiveRoute.put(
  '/archive/:province/:archiveId',
  isAuthenticated,
  isProvinceAdmin,
  uploadArchive.array('archive'),
  validate(archiveSchema),
  async (req, res) => {
    try {
      const archiveId = parseInt(req.params.archiveId);
      const data: archiveTypeSchema = req.body;
      const files = req.files as Express.Multer.File[];
      console.log(data);

      const dataWithoutFiles = {
        title: data.title,
        description: data.description,
        municipality: data.municipality,
      };

      // If you allow file uploads during editing, handle the new files
      let newFiles: { url: string; filename: string }[] = [];
      if (files && files.length > 0) {
        newFiles = files.map((file) => ({
          url: file.path,
          filename: file.filename,
        }));
      }

      const updatedArchive = await db.archive.update({
        where: {
          id: archiveId,
        },
        data: {
          ...dataWithoutFiles,
          files: {
            create: newFiles,
          },
        },
        include: {
          files: true,
        },
      });

      if (data.deletedFiles) {
        for (let filename of data.deletedFiles) {
          await cloudinary.uploader.destroy(filename);
        }
        const filesToDelete = await db.archive.findUnique({
          where: {
            id: archiveId,
          },
          include: {
            files: true,
          },
        });

        const dataToDelete = data.deletedFiles.filter((file) =>
          filesToDelete?.files.some((filename) => file === filename.filename)
        );

        const updatedFiles = await db.archive.update({
          where: { id: archiveId },
          data: {
            files: {
              deleteMany: { filename: { in: dataToDelete } },
            },
          },
          include: {
            files: true,
          },
        });

        return res.status(200).json(updatedFiles);
      }

      return res.status(200).json(updatedArchive);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
);

// Delete archive
archiveRoute.delete(
  '/archive/:province/:archiveId',
  isAuthenticated,
  isProvinceAdmin,
  async (req, res) => {
    try {
      const archiveId = parseInt(req.params.archiveId);

      const archive = await db.archive.findUnique({
        where: {
          id: archiveId,
        },
        include: {
          user: true,
        },
      });

      if (!archive) {
        return res.status(404).json({ message: 'Archive not found' });
      }

      // Delete the archive
      await db.archive.delete({
        where: {
          id: archiveId,
        },
      });

      res.status(200).json({ message: 'Archive deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
);

archiveRoute.get('/archives', isAuthenticated, async (req, res) => {
  const archives = await db.archive.findMany({});

  // const locations = calendars.map((calendar) => calendar.location);

  if (archives) {
    return res.status(200).json(archives);
  }

  return res.status(404).json({ error: 'No locations found!' });
});

//document-archives
archiveRoute.get(
  '/archives/:province/:category',
  isAuthenticated,
  async (req, res) => {
    const province = req.params.province;
    const category = req.params.category;
    const archives = await db.archive.findMany({
      where: {
        category: category,
        province: province,
      },
    });
    console.log(archives);
    if (archives) {
      return res.status(200).json(archives);
    }

    return res.status(404).json({ error: 'No locations found!' });
  }
);

//document-count
archiveRoute.get('/archive-count/:province', async (req, res) => {
  try {
    const province = req.params.province;
    const documentCount = await db.archive.count({
      where: {
        category: 'document',
        province: province,
      },
    });
    const artifactCount = await db.archive.count({
      where: {
        category: 'artifact',
        province: province,
      },
    });
    const monumentCount = await db.archive.count({
      where: {
        category: 'monument',
        province: province,
      },
    });

    res.status(200).json({ documentCount, artifactCount, monumentCount });
  } catch (error) {
    console.error('Error fetching document count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//recent
archiveRoute.get('/recent/:province', isAuthenticated, async (req, res) => {
  try {
    const data = req.params.province;
    const provinceArchives = await db.archive.findMany({
      where: {
        province: data,
      },
      include: {
        files: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
    if (provinceArchives) {
      const extractedData = provinceArchives.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        province: item.province,
        municipality: item.municipality,
        createdAt: item.createdAt,
      }));

      return res.status(200).json({ data: extractedData });
    }

    return res.status(404).json({ message: 'No archives found!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

export default archiveRoute;
