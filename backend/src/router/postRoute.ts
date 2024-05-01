import express from 'express';
import {
  isAuthenticated,
  isAuthor,
  isProvinceAdmin,
  validate,
} from '../middleware/middleware.js';
import { db } from '../utils/db.server.js';
import { upload, cloudinary } from '../utils/cloudinary.js';
import {
  postSchema,
  postTypeSchema,
  sharedPostTypeSchema,
} from '../utils/Schemas.js';
import { catchAsync } from '../middleware/errorHandler.js';
import ExpressError from '../middleware/ExpressError.js';
import { Request, Response } from 'express';

const postRoute = express.Router();

//ADD POST
postRoute.post(
  '/post',
  isAuthenticated,
  upload.array('image'),
  validate(postSchema),
  catchAsync(async (req: Request, res: Response) => {
    const data: postTypeSchema = req.body;
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    const tags = data.tags?.replace(/ /g, '').split(',') || [];

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
        tags: tags,
      },
      include: {
        photos: true,
        user: true,
      },
    });
    if (newPost) {
      return res
        .status(201)
        .json({ message: 'Successfully created new post', data: newPost });
    }

    throw new ExpressError('Failed to create post', 400);
  })
);

// GET ALL THE POST
postRoute.get(
  '/post',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const limit: number = parseInt(req.query.limit as string) || 2;
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
        createdAt: 'desc',
      },
    });

    res.status(200).json(allPost);
  })
);

//fetch all
postRoute.get(
  '/post/all',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const limit: number = parseInt(req.query.limit as string) || 1;
    const regularOffset: number = parseInt(req.query.offset as string) || 0;
    const sharedOffset: number =
      parseInt(req.query.sharedOffset as string) || 0; // New offset for shared posts

    const regularPosts = await db.post.findMany({
      include: {
        photos: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: regularOffset,
      take: limit,
    });

    const regularPostsWithType = regularPosts.map((post) => ({
      ...post,
      type: 'regular',
    }));

    const sharedPosts = await db.sharedPost.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: sharedOffset, // Use separate offset for shared posts
      take: limit,
    });

    const sharedPostsWithType = sharedPosts.map((sharedPost) => ({
      ...sharedPost,
      type: 'shared',
    }));

    const allPosts = [...regularPostsWithType, ...sharedPostsWithType];

    // Sort combined posts by createdAt
    const sortedPosts = allPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json(sortedPosts);
  })
);

// GET SPECIFIC POST
postRoute.get(
  '/post/:id',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    // Get parameter ID
    const postId = parseInt(req.params.id);

    // Find post in the database
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
            province: true,
          },
        }, // Corrected include syntax
      },
    });

    // If post is found, return post
    if (post) {
      return res.status(200).json(post);
    }

    // If not, return not found
    throw new ExpressError('Post not found', 404);
  })
);

postRoute.put(
  '/post/:postId',
  isAuthenticated,
  isAuthor,
  upload.array('image'),
  validate(postSchema),
  catchAsync(async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);
    const data: postTypeSchema = req.body;
    const files = req.files as Express.Multer.File[];
    const tags = data.tags?.replace(/ /g, '').split(',') || [];

    const dataNoFiles = {
      caption: data.caption,
      province: data.province,
      municipality: data.municipality,
      userId: req.session.user?.id,
      tags: tags,
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

      await db.post.update({
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
    }

    return res.status(200).json(updatedPost);
  })
);

postRoute.delete(
  '/post/:postId',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);

    // Find post to delete
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new ExpressError('Post not found', 404);
    }

    // Delete associated SharedPost records first
    await db.sharedPost.deleteMany({
      where: {
        postId: postId,
      },
    });

    // Then delete the Post
    const deletedPost = await db.post.delete({
      where: {
        id: postId,
      },
      include: { photos: true },
    });

    return res
      .status(200)
      .json({ message: `Successfully deleted post! #${deletedPost.id}` });
  })
);

postRoute.post(
  '/post/:postId/report',
  catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const currentUser = req.session.user?.id;
    const { reason } = req.body;

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
      throw new ExpressError('You cannot report your own post or the post does not exist',403);
    }

    // Check if the user has already reported this post
    const existingReport = await db.report.findFirst({
      where: {
        postId: +postId,
        userId: currentUser,
      },
    });

    if (existingReport) {
      throw new ExpressError('You already reported this post',400);
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

      return res.json({ deletedReportedPost, message: 'Post was deleted' });
    }

    return res
      .status(200)
      .json({ message: 'Post reported successfully', updatedPost });
  })
);

//get reports via province e
postRoute.get('/post/reported/:province', isAuthenticated, isProvinceAdmin, async (req, res) => {
  
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
        photos: true,
      },
    });
    if(reportedPosts){
      return res.status(200).json(reportedPosts);
    }
});

//following posts
postRoute.get('/following/posts', isAuthenticated,catchAsync( async (req: Request, res:Response) => {
  const limit: number = parseInt(req.query.limit as string) || 1;
  const regularOffset: number = parseInt(req.query.offset as string) || 0;
  const sharedOffset: number = parseInt(req.query.sharedOffset as string) || 0;
  const userId = req.session.user?.id;


    const followingIds = await db.followers.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });
    const followingUserIds = followingIds.map((entry) => entry.followingId);

    const regularPosts = await db.post.findMany({
      include: {
        photos: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: regularOffset,
      take: limit,
      where: {
        userId: {
          in: followingUserIds,
        },
      },
    });

    const regularPostsWithType = regularPosts.map((post) => ({
      ...post,
      type: 'regular',
    }));

    const sharedPosts = await db.sharedPost.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: sharedOffset, // Use separate offset for shared posts
      take: limit,
      where: {
        userId: {
          in: followingUserIds,
        },
      },
    });

    const sharedPostsWithType = sharedPosts.map((sharedPost) => ({
      ...sharedPost,
      type: 'shared',
    }));

    const allPosts = [...regularPostsWithType, ...sharedPostsWithType];

    // Sort combined posts by createdAt
    const sortedPosts = allPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json(sortedPosts);
}))

//get reports via province e
postRoute.get('/get-post/:userId', isAuthenticated, catchAsync (async (req:Request, res:Response) => {
  
    const userId = parseInt(req.params.userId);

    const posts = await db.post.findMany({
      where: {
        userId: userId,
      },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
    if (posts) {
      return res.status(200).json(posts);
    }
}))

postRoute.get('/user/likes/:id', isAuthenticated,catchAsync (async (req:Request, res:Response) => {
  
    const userIdParam = req.params.id;
    const userId = parseInt(userIdParam);

    if (!userId) {
      throw new Error('Invalid user ID');
    }

    const likedPosts = await db.like.findMany({
      where: {
        userId: userId,
        postId: {
          not: null,
        },
      },
      include: {
        post: {
          include: {
            photos: true,
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(likedPosts);
  
}))

export default postRoute;
