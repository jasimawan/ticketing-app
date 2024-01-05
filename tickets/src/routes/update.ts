import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  BadRequestError,
} from "@jasimawan/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Can't edit a reserved ticket");
    }

    const { title, price } = req.body;

    ticket.set({ title, price });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
