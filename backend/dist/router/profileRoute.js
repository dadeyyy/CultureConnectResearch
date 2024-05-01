<<<<<<< HEAD
import express from 'express';
import { isAuthenticated } from '../middleware/middleware.js';
import { uploadProfile } from '../utils/cloudinary.js';
import { db } from '../utils/db.server.js';
import bcrypt from 'bcrypt';
import { catchAsync } from '../middleware/errorHandler.js';
import ExpressError from '../middleware/ExpressError.js';
const profileRoute = express.Router();
//Create profile picture
profileRoute.post('/profilePicture', isAuthenticated, uploadProfile.single('profile'), catchAsync(async (req, res) => {
=======
import express from "express";
import { isAuthenticated } from "../middleware/middleware.js";
import { uploadProfile } from "../utils/cloudinary.js";
import { db } from "../utils/db.server.js";
import bcrypt from "bcrypt";
import { catchAsync } from "../middleware/errorHandler.js";
import ExpressError from "../middleware/ExpressError.js";
const profileRoute = express.Router();
//Create profile picture
profileRoute.post("/profilePicture", isAuthenticated, uploadProfile.single("profile"), catchAsync(async (req, res) => {
>>>>>>> 6ad2b41808e07d053f46e78b43e6a8026ddc67cb
    const file = req.file;
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
<<<<<<< HEAD
        throw new ExpressError('Failed to update profile picture', 400);
    }
    throw new ExpressError('No file found', 404);
}));
//Edit userInfo
profileRoute.post('/userInfo', isAuthenticated, async (req, res) => {
=======
        throw new ExpressError("Failed to update profile picture", 400);
    }
    throw new ExpressError("No file found", 404);
}));
//Edit userInfo
profileRoute.post("/userInfo", isAuthenticated, async (req, res) => {
>>>>>>> 6ad2b41808e07d053f46e78b43e6a8026ddc67cb
    const sessionId = req.session.user?.id;
    const data = req.body;
    //Check for existing username:
    const existingUser = await db.user.findFirst({
        where: {
            OR: [{ username: data.username }],
        },
    });
    if (existingUser) {
<<<<<<< HEAD
        throw new ExpressError('Username already exists', 409);
=======
        throw new ExpressError("Username already exists", 409);
>>>>>>> 6ad2b41808e07d053f46e78b43e6a8026ddc67cb
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
<<<<<<< HEAD
    throw new ExpressError('Failed to edit user info', 400);
});
profileRoute.post('/changePassword', isAuthenticated, async (req, res) => {
=======
    throw new ExpressError("Failed to edit user info", 400);
});
profileRoute.post("/changePassword", isAuthenticated, async (req, res) => {
>>>>>>> 6ad2b41808e07d053f46e78b43e6a8026ddc67cb
    const sessionId = req.session.user?.id;
    const password = req.body.password;
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
<<<<<<< HEAD
    throw new ExpressError('Failed to edit password', 400);
=======
    throw new ExpressError("Failed to edit password", 400);
});
profileRoute.put("/profile/:id", isAuthenticated, uploadProfile.single("file"), async (req, res) => {
    const sessionId = req.session.user?.id;
    const data = req.body;
    const file = req.file;
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
>>>>>>> 6ad2b41808e07d053f46e78b43e6a8026ddc67cb
});
export default profileRoute;
//# sourceMappingURL=profileRoute.js.map