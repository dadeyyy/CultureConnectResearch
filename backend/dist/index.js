import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import authRouter from './router/authRoute.js';
import postRoute from './router/postRoute.js';
import userRoute from './router/userRoute.js';
import commentRoute from './router/commentRoute.js';
import likeRoute from './router/likeRoute.js';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
const PORT = parseInt(process.env.PORT, 10);
const app = express();
if (!process.env.PORT) {
    process.exit(1);
}
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Specify the origin of your frontend
    credentials: true, // Enable credentials (including cookies)
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000, // 1 hour
        secure: false, // Set to true if using HTTPS
        sameSite: 'lax'
    }
}));
app.use(morgan('tiny'));
//Routers
app.use('/', authRouter);
app.use('/', postRoute);
app.use('/', userRoute);
app.use('/', commentRoute);
app.use('/', likeRoute);
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map