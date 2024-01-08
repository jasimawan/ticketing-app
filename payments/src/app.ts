import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@jasimawan/common";
import { createChargeRouter } from "./routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

// routers
app.use(createChargeRouter);

app.all("*", () => {
  throw new NotFoundError();
});

// middlewares
app.use(errorHandler);

export default app;
