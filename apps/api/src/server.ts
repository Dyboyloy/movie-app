import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./Routes/authRoute";
import userRouter from "./Routes/userRoute";
import cookieParser from "cookie-parser";
import movieRoute from "./Routes/movieRoute";
import adminDashboard from "./Routes/adminDashboard";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors({ credentials: true }))
    .use(cookieParser())
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .use('/api/auth/', authRouter)
    .use('/api/user/', userRouter)
    .use('/api/movies/', movieRoute)
    .use('/api/dashboard', adminDashboard);

  return app;
};
