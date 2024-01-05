import mongoose from "mongoose";
import { Ticket } from "../../../models";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@jasimawan/common";
import { Message } from "node-nats-streaming";
import TicketUpdatedListener from "../ticket-updated";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: "test ticket",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: 999,
    title: "updated ticket title",
    version: ticket.version + 1,
    userId: "dkskdja23",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
  const { data, listener, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("doesn't call ack if the event has skipped a version", async () => {
  const { data, listener, msg } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (e) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
