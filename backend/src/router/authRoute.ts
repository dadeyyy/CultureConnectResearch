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

const authRouter = express.Router();

authRouter.post('/signin', validate(signInSchema), async (req, res) => {
  try {
    const data: signInType = req.body;
    const user = await db.user.findUnique({
      where: {
        username: data.username,
      },
      include: {
        posts: true,
      },
    });

    if (user) {
      const passwordMatch = await bcrypt.compare(data.password, user.password);

      if (passwordMatch) {
        req.session.user = {
          id: user.id,
          username: user.username,
          role: user.role,
        };

        req.session.save((err) => {
          if (err) {
            console.log('Error saving the session', err);
          }
          console.log("SESSION", req.session);
          res.json({
            message: 'authenticated',
            status: 200,
            user: {id: user.id, firstName: user.firstName, lastName: user.lastName,
            username: user.username, email: user.email}
          });
        });
      } else {
        res.json({
          status: 401,
          error: 'Invalid Username or Password',
        });
      }
    } else {
      res.status(404).json({ error: 'Invalid Username or Password' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 500, error: 'Internal Server Error' });
  }
});

authRouter.post('/signup', validate(signUpSchema), async (req, res) => {
  try {
    const data: signUpType = req.body;

    const user = await db.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ error: 'Username or email is already taken' });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await db.user.create({
      data: {
        ...req.body,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    res.status(200).json({
      message: `${newUser.firstName} ${newUser.lastName} was successfully created`,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Cannot Sign-up' });
  }
});

authRouter.post('/logout', (req, res) => {
  if (req.session.user) {
    return req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying the session');
        return res
          .status(500)
          .json({ message: 'Error destroying the session' });
      }
      return res.status(200).json({ message: 'successfully destroyed session' });
    });
  }

  console.log(req.session)
  res.status(404).json({ error: 'No active session to destroy' });
});

export default authRouter;
