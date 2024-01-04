import express, { Request, Response } from "express";
import { Order } from "../models";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@jasimawan/common";

const router = express.Router();

router.delete("/api/orders/:id", async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("ticket");

  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Canceled;

  await order.save();

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
