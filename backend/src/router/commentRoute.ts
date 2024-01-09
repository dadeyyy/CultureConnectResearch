import express from 'express';
import { db } from '../utils/db.server.js';
import {
  isAuthenticated,
  validate,
  isCommentAuthor,
} from '../middleware/middleware.js';
import { commentSchema, commentTypeSchema } from '../utils/Schemas.js';

const commentRoute = express.Router();

commentRoute.get('/post/:postId/comments', isAuthenticated, async (req,res)=>{
  try{
    const postId = req.params.postId;

    //find post with and its comment;
    const comments = await db.comment.findMany({
      where: {
        postId: +postId
      }
    })

    if(comments){
      return res.status(200).json({comments })
    }
  }
  catch(error){
    console.log(error)
  }
})

commentRoute.post(
  '/post/:postId/comment',
  isAuthenticated,
  validate(commentSchema),
  async (req, res) => {
    const postId = req.params.postId;
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

      console.log(comment);


      return res.status(201).json({ message: `Commented ${comment}`, comment });
    } else {
      console.log('No post found');
      return res.status(404).json({ error: "Can't find post" });
    }
  }
);

commentRoute.put(
  '/post/:postId/comment/:commentId',
  isAuthenticated,
  isCommentAuthor,
  validate(commentSchema),
  async (req, res) => {
    try {
      const commentId = req.params.commentId;
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

      return res.status(200).json({
        message: 'Successfully updated the comment!',
        data: updateComment,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error, message: 'INTERNAL SERVER ERROR' });
    }
  }
);

commentRoute.delete(
  '/post/:postId/comment/:commentId',
  isAuthenticated,
  isCommentAuthor,
  async (req, res) => {
    try {
      const { commentId } = req.params;

      const deletedComment = await db.comment.delete({
        where: {
          id: +commentId,
        },
        include: {
          user: true,
        },
      });

      return res
        .status(200)
        .json({
          message: 'Successfully deleted comment',
          data: deletedComment,
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error, message: 'INTERNAL SERVER ERROR!' });
    }
  }
);

export default commentRoute;
