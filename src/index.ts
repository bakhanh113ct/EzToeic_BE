import express, { Express } from "express";
import { AppDataSource } from "./databases/database";
import { JwtPayload } from "jsonwebtoken";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import fs from "fs";

import route from "./routes/index";

declare global {
  namespace Express {
    interface Request {
      auth: JwtPayload;
    }
  }
}

const PORT = process.env.PORT || 3000;

// console.log(process.env.DATABASE_USERNAME);

const app: Express = express();

app.use(
  cors({
    credentials: true,
  })
);

const connect = async () => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  console.log("connect to database done!!!");
};

app.use(bodyParser.json({ limit: "10mb" }));

route(app);

app.listen(PORT, () => {
  connect();

  console.log(`App running on PORT: ${PORT}`);
});
