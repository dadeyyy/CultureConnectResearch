import express from 'express';
import { validate } from '../middleware/middleware.js';
import {
  signInSchema,
  signInType,
  signUpSchema,
  signUpType,
} from '../utils/AuthSchema.js';
import { db } from '../utils/db.server.js';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { cloudflareResponse } from '../utils/liveStreamTypes.js';
import * as dotenv from 'dotenv';
import { catchAsync } from '../middleware/errorHandler.js';
import sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import ExpressError from '../middleware/ExpressError.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const authRouter = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

authRouter.post(
  '/signin',
  validate(signInSchema),
  catchAsync(async (req: Request, res: Response) => {
    //Checks if the user is already signed in
    if (req.session && req.session.user) {
      throw new ExpressError('Already signed in', 400);
    }

    const data: signInType = req.body;
    //Find the user
    const user = await db.user.findUnique({
      where: {
        username: data.username,
      },
      include: {
        posts: true,
      },
    });

    //Check if the user has verified email
    if (user && !user.confirmed) {
      throw new ExpressError('Please confirm your email first', 400);
    }

    //Check if there is a user
    if (user) {
      //Compare the username from the body and username in the database
      const passwordMatch = await bcrypt.compare(data.password, user.password);
      //Check if the password match
      if (passwordMatch) {
        //Adding of the session and returning the user
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) {
              reject(err);
            } else {
              req.session.user = {
                id: user.id,
                username: user.username,
                province: user.province,
                role: user.role,
              };
              res.json({
                message: 'authenticated',
                status: 200,
                user: {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  province: user.province,
                  imageUrl: user.avatarUrl,
                  bio: user.bio,
                },
              });
              resolve();
            }
          });
        });
      } else {
        //If password does not match
        throw new ExpressError('Invalid Username or Password', 401);
      }
    } else {
      throw new ExpressError('Invalid Username or Password', 401);
    }
  })
);

authRouter.post(
  '/signup',
  validate(signUpSchema),
  catchAsync(async (req: Request, res: Response) => {
    

    const data: signUpType = req.body;
    //Generate confirmation token
    const confirmationToken = uuidv4();

    //Check if someone is trying to create an admin
    if (data.role === 'ADMIN') {
      //Superadmin can only create admins, check for superadmins
      // if (!req.session || req.session.user?.role !== "SUPERADMIN") {
      //   return res.status(403).json({ error: "Only superadmins can create admins" });
      // }
      //Check if there is an existing admin for a province
      const existingAdmin = await db.user.findFirst({
        where: {
          role: 'ADMIN',
          province: data.province,
        },
      });

      if (existingAdmin) {
        return res
          .status(400)
          .json({ error: `An admin for ${data.province} already exists` });
      }
    }

    //Check for existing user
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Username or email is already taken' });
    }

    //Creating streamkey from cloudflare
    const response = await axios.post<cloudflareResponse>(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
      {
        meta: { name: `${data.username} livestream` },
        defaultCreator: `${data.username}`,
        recording: { mode: "automatic" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
      }
    );

    const responseData = response.data;
    if (!response.data.success) {
      throw new ExpressError('Cloudflare creation of live input error', 500);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await db.user.create({
      data: {
        ...req.body,
        confirmationToken,
        url: responseData.result.rtmps.url,
        streamKey: responseData.result.rtmps.streamKey,
        videoUID: responseData.result.uid,
        password: hashedPassword,
      },
    });
    if (newUser) {
      const msg = {
        to: newUser.email,
        from: 'andrei.lazo.30@gmail.com',
        subject: 'Confirm your email',
        text: `Click the link to confirm your email: https://culture-connect-research-git-main-dadeyyys-projects.vercel.app/confirm/${confirmationToken}`,
        html: `<strong>Click the link to confirm your email:</strong> <a href="http://localhost:8000/confirm/${confirmationToken}">Confirm Email</a>`,
      };

      await sgMail.send(msg);

      return res.status(200).json({
        message: `${newUser.firstName} ${newUser.lastName} was successfully created. Confirmation email sent.`,
      });
    }
    throw new ExpressError('Failed to create new user', 400)
  })
);

//Confirm email
authRouter.get('/confirm/:token', catchAsync( async (req:Request, res:Response) => {
  const { token } = req.params;
    //Find the user
    const user = await db.user.findFirst({
      where: {
        confirmationToken: token,
      },
    });
    //If no user found
    if (!user) {
      return res.redirect('http://localhost:5173/confirm-email?success=false');
    }

    //Update user status to confirmed
    const updateStatus = await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        confirmed: true,
        confirmationToken: null,
      },
    });
    if(updateStatus){
      return res.redirect('http://localhost:5173/confirm-email?success=true');
    }
    return res.redirect('http://localhost:5173/confirm-email?success=false');
}))


authRouter.post('/logout', (req, res) => {
  //If there is a session
  if (req.session && req.session.user) {
    //Destroy the session
    return req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying the session');
        throw new ExpressError('Error destroying the session', 500)
      }
      return res
        .status(200)
        .json({ message: 'successfully destroyed session' });
    });
  }

  res.status(404).json({ error: 'No active session to destroy' });
});

authRouter.get('/logout',(req,res)=>{
  return req.session.destroy((err)=>{
    if(err){
      console.log('Error destroying the session');
    }
    res.send('Session destroyed')
  })
})

export default authRouter;
