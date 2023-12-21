import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors";

const app = express();
app.use(json());

// routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", () => {
  throw new NotFoundError();
});

// middlewares
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
