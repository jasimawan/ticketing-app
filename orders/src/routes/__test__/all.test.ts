import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models";
import mongoose from "mongoose";

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "test ticket",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  return ticket;
};

it("fetches orders of a user", async () => {
  const ticketOne = await createTicket();
  const ticketTow = await createTicket();
  const ticketThree = await createTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTow.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
