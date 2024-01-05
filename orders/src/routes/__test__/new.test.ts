import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Order, Ticket } from "../../models";
import { OrderStatus } from "@jasimawan/common";
import { natsWrapper } from "../../nats-wrapper";

it("returns error if ticket doesn't exists", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns error if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const order = Order.build({
    userId: "testOrderId",
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket successfully", async () => {
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order create event", async () => {
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
