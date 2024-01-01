import express from 'express';
import { validate } from '../middleware/middleware.js';
import { signInSchema, signUpSchema, } from '../utils/AuthSchema.js';
import { db } from '../utils/db.server.js';
import bcrypt from 'bcrypt';
const authRouter = express.Router();
authRouter.post('/signin', validate(signInSchema), async (req, res) => {
    try {
        const data = req.body;
        const user = await db.user.findFirst({
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
                console.log(req.session);
                res.json({ message: 'authenticated', status: 200, user: user });
            }
            else {
                res.json({
                    status: 401,
                    error: 'Invalid Username or Password',
                });
            }
        }
        else {
            res.status(404).json({ error: 'Invalid Username or Password' });
        }
    }
    catch (error) {
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
});
authRouter.post('/signup', validate(signUpSchema), async (req, res) => {
    try {
        const data = req.body;
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
        res.status(200).json({
            message: `${newUser.firstName} ${newUser.lastName} was successfully created`,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Cannot Sign-up' });
    }
});
authRouter.post('/logout', (req, res) => {
    if (req.session) {
        return req.session.destroy((err) => {
            if (err) {
                console.log('Error destroying the session');
                return res
                    .status(500)
                    .json({ message: 'Error destroying the session' });
            }
            res.status(200).json({ message: 'successfully destroyed session' });
        });
    }
    res.status(404).json({ error: 'No active session to destroy' });
});
export default authRouter;
//# sourceMappingURL=authRoute.js.map