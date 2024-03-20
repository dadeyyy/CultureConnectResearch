import express from 'express';
import { db } from '../utils/db.server.js';
import { isAuthenticated, isProvinceAdmin, validate, } from '../middleware/middleware.js';
import { archiveSchema } from '../utils/Schemas.js';
import { uploadArchive } from '../utils/cloudinary.js';
const archiveRoute = express.Router();
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});
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
        });
    }
    catch (error) {
        console.log(error);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});
export default archiveRoute;
//# sourceMappingURL=archive.js.map