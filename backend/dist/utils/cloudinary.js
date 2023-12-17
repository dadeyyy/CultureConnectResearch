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
        folder: 'uploads', // Specify the folder in Cloudinary
        allowedFormats: ['jpg', 'png'], // Specify allowed file formats
    }
});
const upload = multer({ storage });
export { cloudinary, storage, upload };
//# sourceMappingURL=cloudinary.js.map