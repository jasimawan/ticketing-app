import express from "express";

const router = express.Router();

router.post("/api/users/signin", (req, res) => {
  res.send("Hello world.");
});

export { router as signinRouter };
