import express from 'express';
import { isAuthenticated, validate } from '../middleware/middleware.js';
import { db } from '../utils/db.server.js';
import { upload } from '../utils/cloudinary.js';
import { postSchema } from '../utils/PostSchema.js';
const postRoute = express.Router();
postRoute.post('/post', isAuthenticated, upload.array('image'), validate(postSchema), async (req, res) => {
    try {
        const data = req.body;
        const files = req.files;
        const images = files?.map(file => ({ url: file.path, filename: file.filename }));
        const newPost = await db.post.create({
            data: {
                ...data,
                userId: req.session.user?.id,
                photos: {
                    create: images
                },
            },
            include: {
                photos: true,
            },
        });
        res.status(201).json({ message: 'Successfully created new post', data: newPost });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default postRoute;
//# sourceMappingURL=postRoute.js.map