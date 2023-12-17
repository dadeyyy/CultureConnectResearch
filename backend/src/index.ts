import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import authRouter from './router/authRoute.js';
import postRoute from './router/postRoute.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

if (!process.env.PORT) {
  process.exit(1);
}

declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      role: string;
    };
  }
}

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, //true in prod
  })
);

app.use(cors());
app.use(morgan('tiny'));

//Routers
app.use('/', authRouter);
app.use('/', postRoute);

app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
