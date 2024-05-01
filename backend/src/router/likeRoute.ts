import express from 'express';
import { isAuthenticated } from '../middleware/middleware.js';
import { db } from '../utils/db.server.js';
import ExpressError from '../middleware/ExpressError.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { Request, Response } from 'express';

const likeRoute = express.Router();

// Route to like/unlike a regular post
likeRoute.post(
  '/post/:postId/like',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    const { postId } = req.params;

    const existingLike = await db.like.findFirst({
      where: {
        postId: +postId,
        userId: userId,
      },
    });

    if (existingLike) {
      // If like exists, delete it to unlike
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      const count = await db.like.count({
        where: {
          postId: +postId,
        },
      });

      return res.status(200).json({ message: 'Unliked successfully', count });
    } else {
      // If like does not exist, create a new like for the post
      await db.like.create({
        data: {
          userId: userId as number,
          postId: +postId,
          sharedId: null,
        },
      });

      const count = await db.like.count({
        where: {
          postId: +postId,
        },
      });

      return res.status(201).json({ message: 'Liked successfully', count });
    }
  })
);

// Route to get like status of a regular post
likeRoute.get(
  '/post/:postId/like-status',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    const { postId } = req.params;

    const existingLike = await db.like.findFirst({
      where: {
        postId: +postId,
        userId: userId,
      },
    });

    const isLiked = !!existingLike;

    const count = await db.like.count({
      where: {
        postId: +postId,
      },
    });

    return res.status(200).json({ isLiked, count });
  })
);

// Route to like/unlike a shared post
likeRoute.post(
  '/shared/:sharedId/like',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    const { sharedId } = req.params;

    const existingLike = await db.like.findFirst({
      where: {
        sharedId: +sharedId,
        userId: userId,
      },
    });

    if (existingLike) {
      // If like exists, delete it to unlike
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      const count = await db.like.count({
        where: {
          sharedId: +sharedId,
        },
      });

      res.status(200).json({ message: 'Unliked successfully', count });
    } else {
      // If like does not exist, create a new like for the shared post
      await db.like.create({
        data: {
          userId: userId as number,
          sharedId: +sharedId,
          postId: null,
        },
      });

      const count = await db.like.count({
        where: {
          sharedId: +sharedId,
        },
      });

      res.status(201).json({ message: 'Liked successfully', count });
    }
  })
);

// Route to get like status of a shared post
likeRoute.get(
  '/shared/:sharedId/like-status',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    
    const userId = req.session.user?.id;
    const { sharedId } = req.params;

    const existingLike = await db.like.findFirst({
      where: {
        sharedId: +sharedId,
        userId: userId,
      },
    });

    const isLiked = !!existingLike;

    const count = await db.like.count({
      where: {
        sharedId: +sharedId,
      },
    });

    res.status(200).json({ isLiked, count });
  })
);

export default likeRoute;
