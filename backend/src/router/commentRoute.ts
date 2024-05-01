import express from 'express';
import { db } from '../utils/db.server.js';
import {
  isAuthenticated,
  validate,
  isCommentAuthor,
} from '../middleware/middleware.js';
import { commentSchema, commentTypeSchema } from '../utils/Schemas.js';
import { catchAsync } from '../middleware/errorHandler.js';
import { Request, Response } from 'express';
import ExpressError from '../middleware/ExpressError.js';

const commentRoute = express.Router();

//Finding comments
commentRoute.get(
  '/post/:postId/comments',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const postId = req.params.postId;

    //find post with and its comment;
    const comments = await db.comment.findMany({
      where: {
        postId: +postId,
      },
    });
    if (comments) {
      return res.status(200).json({ comments });
    }
  })
);

commentRoute.post(
  '/post/:postId/comment',
  isAuthenticated,
  validate(commentSchema),
  catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.session.user?.id;
    const data: commentTypeSchema = req.body;

    //Find Post
    const post = await db.post.findUnique({
      where: {
        id: +postId,
      },
    });

    if (post) {
      const comment = await db.comment.create({
        data: {
          content: data.content as string,
          post: {
            connect: { id: +postId as number },
          },
          user: {
            connect: { id: userId as number },
          },
        },
      });
      return res.status(201).json({ message: `Commented ${comment}`, comment });
    }
    throw new ExpressError('No post found', 404);
  })
);

commentRoute.put(
  '/post/:postId/comment/:commentId',
  isAuthenticated,
  isCommentAuthor,
  validate(commentSchema),
  catchAsync(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const data: commentTypeSchema = req.body;

    const updateComment = await db.comment.update({
      where: {
        id: +commentId,
      },
      data: {
        ...data,
      },
      include: {
        user: true,
      },
    });
    if (updateComment) {
      return res.status(200).json({
        message: 'Successfully updated the comment!',
        data: updateComment,
      });
    }
    throw new ExpressError('Failed to update comment', 400);
  })
);

commentRoute.delete(
  '/post/:postId/comment/:commentId',
  isAuthenticated,
  isCommentAuthor,
  catchAsync(async (req: Request, res: Response) => {
    const { commentId } = req.params;

    const deletedComment = await db.comment.delete({
      where: {
        id: +commentId,
      },
      include: {
        user: true,
      },
    });
    if (deletedComment) {
      return res.status(200).json({
        message: 'Successfully deleted comment',
        data: deletedComment,
      });
    }
    throw new ExpressError('Failed to delete comment', 400);
  })
);

commentRoute.get(
  '/post/:postId/comments',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;

    const commentCount = await db.comment.count({
      where: {
        postId: +postId,
      },
    });
    if (commentCount) {
      return res.status(200).json({ commentCount });
    }
  })
);

commentRoute.get(
  '/shared-post/:postId/comments',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const postId = req.params.postId;

    // Find shared post and its comments
    const comments = await db.comment.findMany({
      where: {
        sharedId: +postId,
      },
    });

    if (comments) {
      return res.status(200).json({ comments });
    }
  })
);

commentRoute.post(
  '/shared-post/:postId/comment',
  isAuthenticated,
  validate(commentSchema),
  catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.session.user?.id;
    const data: commentTypeSchema = req.body;

    // Find SharedPost
    const sharedPost = await db.sharedPost.findUnique({
      where: {
        id: +postId,
      },
    });

    if (sharedPost) {
      const comment = await db.comment.create({
        data: {
          content: data.content as string,
          share: {
            connect: { id: +postId as number },
          },
          user: {
            connect: { id: userId as number },
          },
        },
      });

      return res
        .status(201)
        .json({ message: `Commented on Shared Post`, comment });
    }
    throw new ExpressError('No shared post found', 404);
  })
);

commentRoute.put(
  '/shared-post/:postId/comment/:commentId',
  isAuthenticated,
  isCommentAuthor,
  validate(commentSchema),
  catchAsync(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const data: commentTypeSchema = req.body;

    const updateComment = await db.comment.update({
      where: {
        id: +commentId,
      },
      data: {
        ...data,
      },
      include: {
        user: true,
      },
    });
    if (updateComment) {
      return res.status(200).json({
        message: 'Successfully updated the comment!',
        data: updateComment,
      });
    }
    throw new ExpressError('Failed to update comment', 404);
  })
);

commentRoute.delete(
  '/shared-post/:postId/comment/:commentId',
  isAuthenticated,
  isCommentAuthor,
  catchAsync(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const deletedComment = await db.comment.delete({
      where: {
        id: +commentId,
      },
      include: {
        user: true,
      },
    });
    if (deletedComment) {
      return res.status(200).json({
        message: 'Successfully deleted comment',
        data: deletedComment,
      });
    }

    throw new ExpressError('Failed to delete comment', 400);
  })
);

commentRoute.get(
  '/shared-post/:postId/comments-count',
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;

    const commentCount = await db.comment.count({
      where: {
        sharedId: +postId,
      },
    });
    if (commentCount) {
      return res.status(200).json({ commentCount });
    }
  })
);

export default commentRoute;
