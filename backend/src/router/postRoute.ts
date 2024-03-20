import express from 'express';
import {
  isAuthenticated,
  isAuthor,
  validate,
} from '../middleware/middleware.js';
import { db } from '../utils/db.server.js';
import { upload, cloudinary } from '../utils/cloudinary.js';
import {
  exploreSchema,
  exploreTypeSchema,
  postSchema,
  postTypeSchema,
} from '../utils/Schemas.js';

const postRoute = express.Router();

//ADD POST
postRoute.post(
  '/post',
  isAuthenticated,
  upload.array('image'),
  validate(postSchema),
  async (req, res) => {
    try {
      const data: postTypeSchema = req.body;
      const files: Express.Multer.File[] = req.files as Express.Multer.File[];
      console.log(data);
      console.log(files);
      const images = files?.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));

      const newPost = await db.post.create({
        data: {
          ...data,
          userId: req.session.user?.id!,
          photos: {
            create: images,
          },
        },
        include: {
          photos: true,
          user: true,
        },
      });

      res
        .status(201)
        .json({ message: 'Successfully created new post', data: newPost });
    } catch (error) {
      console.log("TEST");
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// postRoute.post('/explore', isAuthenticated, upload.array('image'), validate(exploreSchema) , async(req,res)=>{
//   try {
//     const data: exploreTypeSchema = req.body;
//     const files: Express.Multer.File[] = req.files as Express.Multer.File[];
//     console.log(data);
//     console.log(files);
//     const images = files?.map((file) => ({
//       url: file.path,
//       filename: file.filename,
//     }));

//     const newPost = await db.explore.create({
//       data: {
//         ...data,
//         photos: {
//           create: images,
//         },
//       },
//       include: {
//         photos: true
//       }
//     });

//     res
//       .status(201)
//       .json({ message: 'Successfully created new archive!', data: newPost });
//   } catch (error) {
//     console.log("TEST");
//     console.log(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// })

// postRoute.get('/explore',isAuthenticated, async(req,res) =>{
//   try{
//     const explore = await db.explore.findMany()

//     if(explore){
//       return res.status(200).json(explore)
//     }

//   }
//   catch(error){
//     console.log(error)
//     return res.status(500).json(error)
//   }
// })

// GET ALL THE POST
postRoute.get('/post', isAuthenticated, async (req, res) => {
  try {
    const allPost = await db.post.findMany({
      include: {
        photos: true,
        user: true,
        comments: true,
      },
    });
    res.status(200).json(allPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Cannot get the posts' });
  }
});

// GET SPECIFIC POST
postRoute.get('/post/:id', async (req, res) => {
  try {
    //Get parameters ID
    const postId = parseInt(req.params.id);

    //Find post in the database
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        photos: true,
      },
    });

    //If post is found, return post
    if (post) {
      return res.status(200).json(post);
    }

    //If not, return not found
    return res.status(404).json({ error: 'Post not found!' });
  } catch (error) {
    console.log(error);
  }
});

postRoute.put(
  '/post/:postId',
  isAuthenticated,
  isAuthor,
  upload.array('image'),
  validate(postSchema),
  async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const data: postTypeSchema = req.body;
      const files: Express.Multer.File[] = req.files as Express.Multer.File[];

      // Check if post with the given ID exists
      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
        include: { photos: true },
      });

      // If not, return not found
      if (!post) {
        return res.status(404).json({ error: 'Post not found!' });
      }

      // Create an array of new photos to add
      const newPhotos = files?.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));

      // Update the post data
      const updatedPost = await db.post.update({
        where: { id: postId },
        data: {
          ...data,
          userId: req.session.user?.id,
          // Add new photos to the existing ones
          photos: {
            create: newPhotos,
          },
        },
        include: { photos: true, user: true },
      });

      // If there are images to delete, remove them
      if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        const imagesToDelete = req.body.deleteImages;

        await db.post.update({
          where: { id: postId },
          data: {
            photos: {
              deleteMany: {
                id: { in: imagesToDelete },
              },
            },
          },
        });
      }

      res
        .status(200)
        .json({ message: 'Successfully updated post', data: updatedPost });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

postRoute.delete(
  '/post/:postId',
  isAuthenticated,
  isAuthor,
  async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);

      //Find post to delete
      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post) {
        const deletedPost = await db.post.delete({
          where: {
            id: +postId,
          },
          include: { photos: true },
        });

        return res
          .status(200)
          .json({ message: `Successfully deleted post! #${deletedPost.id}` });
      }

      return res.status(404).json({ error: "Can't find post!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error, message: 'Internal Server Error!' });
    }
  }
);

postRoute.post('/post/:postId/report', async (req, res) => {
  const postId = req.params.postId;
  const currentUser = req.session.user?.id;

  try {
    // Find post
    const post = await db.post.findUnique({
      where: {
        id: +postId,
      },
      include: {
        user: true,
      },
    });

    // Determine if the post is the current user's post, if not, proceed to report
    if (!post || post.user.id === currentUser) {
      return res.status(403).json({
        error: 'You cannot report your own post or the post does not exist',
      });
    }

    // Check if the user has already reported this post
    const existingReport = await db.report.findFirst({
      where: {
        postId: +postId,
        userId: currentUser,
      },
    });

    if (existingReport) {
      return res
        .status(400)
        .json({ error: 'You have already reported this post' });
    }

    // Create a report record
    await db.report.create({
      data: {
        postId: +postId as number,
        userId: currentUser as number,
      },
    });

    // Update the reportCount field in the Post model
    const updatedPost = await db.post.update({
      where: {
        id: +postId,
      },
      data: {
        reportCount: {
          increment: 1,
        },
      },
      include: {
        reports: true,
      },
    });

    if (updatedPost.reports.length > 2) {
      const deletedReportedPost = await db.post.delete({
        where: {
          id: +postId,
        },
        include: {
          reports: true,
        },
      });

      return res.json({ deletedReportedPost, message: 'Post was deleted' });
    }

    return res
      .status(200)
      .json({ message: 'Post reported successfully', updatedPost });
  } catch (error) {
    console.log('Error');
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default postRoute;
