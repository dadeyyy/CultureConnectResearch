import express, { Express, Request, Response } from 'express';
import * as z from 'zod';

export const validate =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, res: Response, next: () => void) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zError = error.issues[0].message;
        return res.status(500).json({ error: zError });
      }
      return res.status(400).json({ message: 'Invalid Data', error: error });
    }
  };

export function isAuthenticated(req: Request, res: Response, next: () => void) {
  if (req.session.user) {
    console.log(req.session.user)
    next();
  }
  else{
    return res.status(401).json({error: "User not authorized"})
  }
}
