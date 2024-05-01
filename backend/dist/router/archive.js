import express from 'express';
import { db } from '../utils/db.server.js';
import { isAuthenticated, isProvinceAdmin, validate, } from '../middleware/middleware.js';
import { archiveSchema } from '../utils/Schemas.js';
import * as dotenv from 'dotenv';
import { cloudinary, uploadArchive } from '../utils/cloudinary.js';
import Geocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import { catchAsync } from '../middleware/errorHandler.js';
import ExpressError from '../middleware/ExpressError.js';
const archiveRoute = express.Router();
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
const geocoder = Geocoding({ accessToken: process.env.MAPBOX_TOKEN });
//Get specific archive
archiveRoute.get('/archive/:province/:archiveId', isAuthenticated, catchAsync(async (req, res) => {
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
        throw new ExpressError('Archive not found!', 404);
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
    return res.status(200).json({ data: extractedData });
}));
//Viewing of archives;
archiveRoute.get('/archive/:province', isAuthenticated, catchAsync(async (req, res) => {
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
    throw new ExpressError('No archives found!', 404);
}));
//Creation of archives
archiveRoute.post('/archive/:province', isAuthenticated, isProvinceAdmin, uploadArchive.array('archive'), validate(archiveSchema), catchAsync(async (req, res) => {
    const data = req.body;
    const files = req.files;
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
    const location = geoData.body.features[0].geometry;
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
    if (newArchive) {
        return res.status(201).json({
            message: 'Successfully created new archive',
            data: newArchive,
        });
    }
    throw new ExpressError('Failed to create new archive', 400);
}));
// Edit archive
archiveRoute.put('/archive/:province/:archiveId', isAuthenticated, isProvinceAdmin, uploadArchive.array('archive'), validate(archiveSchema), catchAsync(async (req, res) => {
    const archiveId = parseInt(req.params.archiveId);
    const data = req.body;
    const files = req.files;
    const dataWithoutFiles = {
        title: data.title,
        description: data.description,
        municipality: data.municipality,
    };
    // If you allow file uploads during editing, handle the new files
    let newFiles = [];
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
        const dataToDelete = data.deletedFiles.filter((file) => filesToDelete?.files.some((filename) => file === filename.filename));
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
    if (updatedArchive) {
        return res.status(200).json(updatedArchive);
    }
    throw new ExpressError('Failed to edit archive', 400);
}));
// Delete archive
archiveRoute.delete('/archive/:province/:archiveId', isAuthenticated, isProvinceAdmin, catchAsync(async (req, res) => {
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
        throw new ExpressError('Archive not found', 404);
    }
    // Delete the archive
    await db.archive.delete({
        where: {
            id: archiveId,
        },
    });
    return res.status(200).json({ message: 'Archive deleted successfully' });
}));
archiveRoute.get('/archives', isAuthenticated, catchAsync(async (req, res) => {
    const archives = await db.archive.findMany({});
    if (archives) {
        return res.status(200).json(archives);
    }
    throw new ExpressError('No archives found', 404);
}));
//document-archives
archiveRoute.get('/archives/:province/:category', isAuthenticated, catchAsync(async (req, res) => {
    const { province, category } = req.params;
    const archives = await db.archive.findMany({
        where: {
            category: category,
            province: province,
        },
    });
    if (archives) {
        return res.status(200).json(archives);
    }
    throw new ExpressError(`No archives for ${province} found`, 404);
}));
//document-count
archiveRoute.get('/archive-count/:province', catchAsync(async (req, res) => {
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
}));
//recent
archiveRoute.get('/recent/:province', isAuthenticated, catchAsync(async (req, res) => {
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
    throw new ExpressError('No archives found', 404);
}));
export default archiveRoute;
//# sourceMappingURL=archive.js.map