import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import authRouter from './router/authRoute.js';
import postRoute from './router/postRoute.js';
dotenv.config();
const PORT = parseInt(process.env.PORT, 10);
const app = express();
if (!process.env.PORT) {
    process.exit(1);
}
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, //true in prod
}));
app.use(cors());
app.use(morgan('tiny'));
//Routers
app.use('/', authRouter);
app.use('/', postRoute);
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map