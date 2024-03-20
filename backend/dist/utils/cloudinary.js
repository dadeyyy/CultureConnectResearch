import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowedFormats: ['jpg', 'png'],
    },
});
const upload = multer({ storage });
const archiveStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'archives',
        allowedFormats: ['jpg', 'png', 'jpeg', 'pdf', 'mp4'],
        resource_type: 'auto'
    },
});
const uploadArchive = multer({ storage: archiveStorage });
export { cloudinary, storage, upload, uploadArchive, archiveStorage };
//# sourceMappingURL=cloudinary.js.map