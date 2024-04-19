import express from "express";
import { validate } from "../middleware/middleware.js";
import { signInSchema, signUpSchema } from "../utils/AuthSchema.js";
import { db } from "../utils/db.server.js";
import bcrypt from "bcrypt";
import axios from 'axios';
const authRouter = express.Router();
authRouter.post("/signin", validate(signInSchema), async (req, res) => {
    try {
        const data = req.body;
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
                    province: user.province,
                    role: user.role,
                };
                req.session.save((err) => {
                    if (err) {
                        console.log("Error saving the session", err);
                    }
                    console.log("SESSION", req.session);
                    res.json({
                        message: "authenticated",
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
                });
            }
            else {
                res.json({
                    status: 401,
                    error: "Invalid Username or Password",
                });
            }
        }
        else {
            res.status(404).json({ error: "Invalid Username or Password" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, error: "Internal Server Error" });
    }
});
authRouter.post("/signup", validate(signUpSchema), async (req, res) => {
    try {
        const data = req.body;
        //Check if someone is trying to create an admin
        if (data.role === "ADMIN") {
            //Superadmin can only create admins, check for superadmins
            if (!req.session || req.session.user?.role !== "SUPERADMIN") {
                return res.status(403).json({ error: "Only superadmins can create admins" });
            }
            //Check if there is an existing admin for a province
            const existingAdmin = await db.user.findFirst({
                where: {
                    role: "ADMIN",
                    province: data.province,
                },
            });
            if (existingAdmin) {
                return res.status(400).json({ error: `An admin for ${data.province} already exists` });
            }
        }
        //Check for existing user
        const existingUser = await db.user.findFirst({
            where: {
                OR: [{ username: data.username }, { email: data.email }],
            },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email is already taken" });
        }
        const response = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`, {
            meta: { name: `${data.username} livestream` },
            defaultCreator: `${data.username}`,
            recording: { mode: 'off' },
        }, {
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
            },
        });
        const responseData = response.data;
        if (!responseData.success) {
            return res.status(500).json({ error: "Cloudflare creation of live input error!" });
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await db.user.create({
            data: {
                ...req.body,
                url: responseData.result.rtmps.url,
                streamKey: responseData.result.rtmps.streamKey,
                videoUID: responseData.result.uid,
                password: hashedPassword,
            },
        });
        console.log(newUser);
        res.status(200).json({
            message: `${newUser.firstName} ${newUser.lastName} was successfully created`,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Cannot Sign-up" });
    }
});
authRouter.post("/logout", (req, res) => {
    if (req.session.user) {
        return req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying the session");
                return res.status(500).json({ message: "Error destroying the session" });
            }
            return res.status(200).json({ message: "successfully destroyed session" });
        });
    }
    console.log(req.session);
    res.status(404).json({ error: "No active session to destroy" });
});
export default authRouter;
//# sourceMappingURL=authRoute.js.map