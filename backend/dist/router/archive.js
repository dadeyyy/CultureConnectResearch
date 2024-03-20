import express from 'express';
import { db } from '../utils/db.server.js';
<<<<<<< HEAD
import { isAuthenticated, isProvinceAdmin, validate, } from '../middleware/middleware.js';
=======
import { isAuthenticated, validate, isAdmin, } from '../middleware/middleware.js';
>>>>>>> 8c62ce15d470567560c8a29138947be51551bb08
import { archiveSchema } from '../utils/Schemas.js';
import { uploadArchive } from '../utils/cloudinary.js';
const archiveRoute = express.Router();
<<<<<<< HEAD
function generateRandomId() {
    return Math.floor(Math.random() * 90000) + 10000;
}
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
                municipality: item.municipality,
                files: item.files.map((file) => file.url),
            }));
            return res.status(200).json({ data: extractedData });
        }
        return res.status(404).json({ message: 'No archives found!' });
=======
//Getting all the archives
archiveRoute.get('/archive', isAuthenticated, async (req, res) => {
    try {
        const archives = await db.archive.findMany({});
        if (archives) {
            return res.status(200).json({ archives });
        }
        return res.status(404).json({ message: "No archives found" });
>>>>>>> 8c62ce15d470567560c8a29138947be51551bb08
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});
<<<<<<< HEAD
//Creation of archives
archiveRoute.post('/archive/:province', isAuthenticated, isProvinceAdmin, uploadArchive.array('archive'), validate(archiveSchema), async (req, res) => {
    try {
        const data = req.body;
        const files = req.files;
        const archiveFile = files.map((file) => ({
            url: file.path,
            filename: file.filename,
        }));
        const newArchive = await db.archive.create({
            data: {
                ...data,
                province: req.session.user?.province ?? '',
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
=======
// Creating an archive
archiveRoute.post('/archive', isAuthenticated, isAdmin, validate(archiveSchema), async (req, res) => {
    try {
        const data = req.body;
        const newArchive = await db.archive.create({
            data,
        });
        res
            .status(201)
            .json({ message: 'Archive created successfully', data: newArchive });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Updating an archive
archiveRoute.put('/archive/:archiveId', isAuthenticated, isAdmin, validate(archiveSchema), async (req, res) => {
    try {
        const archiveId = parseInt(req.params.archiveId);
        const data = req.body;
        const archive = await db.archive.findUnique({
            where: {
                id: archiveId,
            },
        });
        if (!archive) {
            return res.status(404).json({ error: 'Archive not found!' });
        }
        const updatedArchive = await db.archive.update({
            where: { id: archiveId },
            data,
        });
        res
            .status(200)
            .json({
            message: 'Archive updated successfully',
            data: updatedArchive,
>>>>>>> 8c62ce15d470567560c8a29138947be51551bb08
        });
    }
    catch (error) {
        console.log(error);
<<<<<<< HEAD
        res.status(500).json({ message: 'Cannot create new archive', error });
    }
});
// archiveRoute.put(
//   '/archive/:id',
//   isAuthenticated,
//   // isProvinceAdmin,
//   uploadArchive.array('archive'),
//   validate(archiveSchema),
//   async (req, res) => {
//     try {
//       const { id } = req.params;
//       const files = req.files as Express.Multer.File[];
//       const data: archiveTypeSchema = req.body;
//       // Find archive
//       const existingArchive = await db.archive.findUnique({
//         where: {
//           id: parseInt(id),
//         },
//         include: {
//           files: true,
//         },
//       });
//       if (!existingArchive) {
//         return res.status(404).json({ message: 'Archive not found' });
//       }
//       const existingFiles = existingArchive.files;
//       // Construct updated files array by merging existing files and new files
//       const updatedFiles = [
//         ...existingFiles,
//         ...files.map(file => ({
//           archiveId: parseInt(id),
//           id: generateRandomId(),
//           url: file.path, // Assuming file.path contains the Cloudinary URL
//           filename: file.filename,
//         }))
//       ];
//       // Update the archive with the combined files
//       await db.archive.update({
//         where: {
//           id: parseInt(id),
//         },
//         data: {
//           ...data,
//           files: {
//             create: updatedFiles,
//           },
//         },
//       });
//       res.status(200).json({ message: 'Archive updated successfully' });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Cannot update archive', error });
//     }
//   }
// );
// Delete archive
archiveRoute.delete('/archive/:province/:archiveId', isAuthenticated, isProvinceAdmin, async (req, res) => {
=======
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Deleting an archive
archiveRoute.delete('/archive/:archiveId', isAuthenticated, isAdmin, async (req, res) => {
>>>>>>> 8c62ce15d470567560c8a29138947be51551bb08
    try {
        const archiveId = parseInt(req.params.archiveId);
        const archive = await db.archive.findUnique({
            where: {
                id: archiveId,
            },
<<<<<<< HEAD
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
=======
        });
        if (!archive) {
            return res.status(404).json({ error: 'Archive not found!' });
        }
        await db.archive.delete({
            where: { id: archiveId },
>>>>>>> 8c62ce15d470567560c8a29138947be51551bb08
        });
        res.status(200).json({ message: 'Archive deleted successfully' });
    }
    catch (error) {
<<<<<<< HEAD
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
=======
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
>>>>>>> 8c62ce15d470567560c8a29138947be51551bb08
    }
});
export default archiveRoute;
//# sourceMappingURL=archive.js.map