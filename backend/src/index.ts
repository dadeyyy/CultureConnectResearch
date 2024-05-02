import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import morgan from "morgan";
import authRouter from "./router/authRoute.js";
import postRoute from "./router/postRoute.js";
import userRoute from "./router/userRoute.js";
import commentRoute from "./router/commentRoute.js";
import likeRoute from "./router/likeRoute.js";
import calendarRoute from "./router/calendarRoute.js";
import algoRoute from "./router/algoRoute.js";
import archiveRoute from "./router/archive.js";
import followRouter from "./router/followRoute.js";
import liveStreamRoute from "./router/liveStream.js";
import profileRoute from "./router/profileRoute.js";
import { createServer } from "node:http";
import socket from "./socket.js";
import shareRoute from "./router/shareRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";
import heritageRoute from "./router/heritage.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { db } from "./utils/db.server.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const server = createServer(app);

socket(server);

declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      username: string;
      role: string;
      province: string | null;
    };
  }
}

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Enable credentials (including cookies)
  })
);

app.use(
  session({
    cookie: {
      maxAge: 3600000, // 1 hour
      secure: false, // Set to true if using HTTPS
      sameSite: "lax",
    },
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(db, {
      checkPeriod: 1 * 60 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(morgan("tiny"));

//Routers

app.use("/", authRouter);
app.use("/", postRoute);
app.use("/", userRoute);
app.use("/", commentRoute);
app.use("/", likeRoute);
app.use("/", calendarRoute);
app.use("/", algoRoute);
app.use("/", archiveRoute);
app.use("/", liveStreamRoute);
app.use("/", followRouter);
app.use("/", shareRoute);
app.use("/", heritageRoute);
app.use("/", profileRoute);

app.all("*", (req, res) => {
  res.redirect("http://localhost:5173/");
  res.status(404).send("404 Not Found");
});

//Error Handler:
app.use(errorHandler);
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`);
});
