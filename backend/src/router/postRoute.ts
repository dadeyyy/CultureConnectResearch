import express from 'express';
import {
  isAuthenticated,
  isAuthor,
  validate,
} from '../middleware/middleware.js';
import { db } from '../utils/db.server.js';
import { upload, cloudinary } from '../utils/cloudinary.js';
import { postSchema, postTypeSchema } from '../utils/Schemas.js';

const postRoute = express.Router();

//ADD POST
postRoute.post(
  "/post",
  isAuthenticated,
  upload.array("image"),
  validate(postSchema),
  async (req, res) => {
    try {
      const data: postTypeSchema = req.body;
      const files: Express.Multer.File[] = req.files as Express.Multer.File[];

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

      res.status(201).json({ message: "Successfully created new post", data: newPost });
    } catch (error) {
      console.log('TEST');
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// GET ALL THE POST
postRoute.get('/post', isAuthenticated, async (req, res) => {
  try {
    const limit: number = parseInt(req.query.limit as string) || 1;
    const offset: number = parseInt(req.query.offset as string) || 0;

    const allPost = await db.post.findMany({
      include: {
        photos: true,
        user: true,
        comments: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(allPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Cannot get the posts" });
  }
});

// GET ALL THE POST
// postRoute.get("/post", isAuthenticated, async (req, res) => {
//   try {
//     const allPost = await db.post.findMany({
//       include: {
//         photos: true,
//         user: true,
//         comments: true,
//       },
//     });
//     res.status(200).json(allPost);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Cannot get the posts" });
//   }
// });

// GET SPECIFIC POST
postRoute.get("/post/:id", async (req, res) => {
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
    return res.status(404).json({ error: "Post not found!" });
  } catch (error) {
    console.log(error);
  }
});

postRoute.put(
  "/post/:postId",
  isAuthenticated,
  isAuthor,
  upload.array("image"),
  validate(postSchema),
  async (req, res) => {

    try{

      const postId = parseInt(req.params.postId);
      const data: postTypeSchema = req.body;
      const files = req.files as Express.Multer.File[];

      const dataNoFiles = {
        caption: data.caption,
        province: data.province,
        municipality: data.municipality,
        userId: req.session.user?.id,
      };
      
      let newFiles: { url: string; filename: string }[] = [];
      if (files && files.length > 0) {
        newFiles = files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
    }

    const updatedPost = await db.post.update({
      where: {
        id: postId,
      },
      data: {
        ...dataNoFiles,
        photos: {
          create: newFiles,
        },
      },
      include: {
        photos: true,
      },
    });

    if (data.deletedFiles) {
      for (let filename of data.deletedFiles) {
        await cloudinary.uploader.destroy(filename);
      }
      
      const filesToDelete = await db.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          photos: true,
        },
      });
      
      const dataToDelete = data.deletedFiles.filter((file) =>
      filesToDelete?.photos.some((filename) => file === filename.filename)
      );
      
      const updatedFiles = await db.post.update({
        where: { id: postId },
        data: {
          photos: {
            deleteMany: { filename: { in: dataToDelete } },
          },
        },
        include: {
          photos: true,
        },
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

      res.status(200).json({ message: "Successfully updated post", data: updatedPost });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    
    return res.status(200).json(updatedPost);
  }
  catch(error){
    console.log(error);
    return res.status(500).json(error)
  }
  }
);

postRoute.delete("/post/:postId", isAuthenticated, async (req, res) => {
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

      return res.status(200).json({ message: `Successfully deleted post! #${deletedPost.id}` });
    }

    return res.status(404).json({ error: "Can't find post!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, message: "Internal Server Error!" });
  }
});

postRoute.post("/post/:postId/report", async (req, res) => {
  const postId = req.params.postId;
  const currentUser = req.session.user?.id;
  const { reason } = req.body;

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
        error: "You cannot report your own post or the post does not exist",
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
      return res.status(400).json({ error: "You have already reported this post" });
    }

    // Create a report record
    await db.report.create({
      data: {
        postId: +postId as number,
        userId: currentUser as number,
        reportReason: reason,
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

      return res.json({ deletedReportedPost, message: "Post was deleted" });
    }

    return res.status(200).json({ message: "Post reported successfully", updatedPost });
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

postRoute.get("/post/reported/:province", isAuthenticated, async (req, res) => {
  try {
    const province = req.params.province;

    const reportedPosts = await db.post.findMany({
      where: {
        reports: {
          some: {
            AND: [{ post: { province } }],
          },
        },
      },
      include: {
        reports: true,
        user: true,
      },
    });

    res.status(200).json(reportedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Cannot get the reported posts" });
  }
});

export default postRoute;
