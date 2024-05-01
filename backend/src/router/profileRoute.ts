import express from 'express';
import { isAuthenticated } from '../middleware/middleware.js';
import { profileStorage, uploadProfile } from '../utils/cloudinary.js';
import { db } from '../utils/db.server.js';
import bcrypt from 'bcrypt';
import { catchAsync } from '../middleware/errorHandler.js';
import { Request, Response } from 'express';
import ExpressError from '../middleware/ExpressError.js';

const profileRoute = express.Router();

type userInfo = {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
};

//Create profile picture
profileRoute.post(
  '/profilePicture',
  isAuthenticated,
  uploadProfile.single('profile'),
  catchAsync(async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    const sessionId = req.session.user?.id;
    if (file) {
      const userWithProfile = await db.user.update({
        where: {
          id: sessionId,
        },
        data: {
          avatarUrl: file.path,
        },
      });
      if (userWithProfile) {
        return res.status(200).json({ url: userWithProfile.avatarUrl });
      }
      throw new ExpressError('Failed to update profile picture', 400);
    }
    throw new ExpressError('No file found', 404);
  })
);

//Edit userInfo
profileRoute.post('/userInfo', isAuthenticated, async (req, res) => {
  const sessionId = req.session.user?.id;
  const data: userInfo = req.body;

  //Check for existing username:
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ username: data.username }],
    },
  });

  if (existingUser) {
    throw new ExpressError('Username already exists', 409);
  }

  const updatedUserInfo = await db.user.update({
    where: {
      id: sessionId,
    },
    data: {
      ...data,
    },
  });

  if (updatedUserInfo) {
    return res.status(200).json(updatedUserInfo);
  }
  throw new ExpressError("Failed to edit user info", 400);
});

profileRoute.post("/changePassword", isAuthenticated, async (req, res) => {
  const sessionId = req.session.user?.id;
  const password: string = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedPassword = await db.user.update({
    where: {
      id: sessionId,
    },
    data: {
      password: hashedPassword,
    },
  });

  if (updatedPassword) {
    return res.status(200).json(updatedPassword);
  }
  throw new ExpressError("Failed to edit password", 400);
});

profileRoute.put(
  "/profile/:id",
  isAuthenticated,
  uploadProfile.single("file"),
  async (req, res) => {
    const sessionId = req.session.user?.id;
    const data: userInfo = req.body;
    const file = req.file as Express.Multer.File;

    // If a file is uploaded, update profile picture
    if (file) {
      const userWithProfile = await db.user.update({
        where: { id: sessionId },
        data: { avatarUrl: file.path },
      });
      if (userWithProfile) {
        return res.status(200).json({ url: userWithProfile.avatarUrl });
      }
      throw new ExpressError("Failed to update profile picture", 400);
    }

    // If no file uploaded, edit user info
    const existingUser = await db.user.findFirst({
      where: { OR: [{ username: data.username }] },
    });

    if (existingUser) {
      throw new ExpressError("Username already exists", 409);
    }

    const updatedUserInfo = await db.user.update({
      where: { id: sessionId },
      data: { ...data },
    });

    if (updatedUserInfo) {
      return res.status(200).json(updatedUserInfo);
    }
    throw new ExpressError("Failed to edit user info", 400);
  }
);

export default profileRoute;
