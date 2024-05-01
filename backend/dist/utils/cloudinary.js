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
        allowedFormats: ['jpg', 'png', 'mp4'],
    },
});
const upload = multer({ storage });
const archiveStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'archives',
        allowedFormats: ['jpg', 'png', 'jpeg', 'pdf', 'mp4'],
        resource_type: 'auto',
        access_mode: 'public'
    },
});
const uploadArchive = multer({ storage: archiveStorage });
const heritageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'heritage',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    }
});
const uploadHeritage = multer({ storage: heritageStorage });
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'User Profiles',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    }
});
const uploadProfile = multer({ storage: profileStorage });
export { cloudinary, storage, upload, uploadArchive, archiveStorage, heritageStorage, uploadHeritage, profileStorage, uploadProfile };
//# sourceMappingURL=cloudinary.js.map