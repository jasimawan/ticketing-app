import express, { Request, Response } from "express";
import { Order } from "../models";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@jasimawan/common";
import { OrderCanceledPublisher } from "../events/publishers";
import { natsWrapper } from "../nats-wrapper";

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

  await new OrderCanceledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: { id: order.ticket.id },
  });

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
