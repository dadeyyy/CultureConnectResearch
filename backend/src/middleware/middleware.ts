import express, { Express, Request, Response } from 'express';
import * as z from 'zod';
import { db } from '../utils/db.server.js';

export const validate =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, res: Response, next: () => void) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zError = error.issues[0].message;
        console.log(zError);
        return res.status(500).json({ error: zError });
      }
      return res.status(400).json({ message: 'Invalid Data', error: error });
    }
  };

export function isAuthenticated(req: Request, res: Response, next: () => void) {
  if (req.session.user) {
    console.log(req.session.user);
    next();
  } else {
    return res.status(401).json({ error: 'User not authenticated!' });
  }
}

export const isAuthor = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const postId = parseInt(req.params.postId);
  const username = req.session.user?.username;

  try {
    //find post
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: { user: true },
    });

    const user = post?.user.username;
    const authorized =  username === user;
    if (post && authorized) {
      console.log('Authorized');
      next(); 
    } else {
      return res.status(500).json({ error: 'Unauthorized!!!' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

