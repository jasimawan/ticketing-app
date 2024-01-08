import { OrderCanceledEvent, OrderStatus } from "@jasimawan/common";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import OrderCanceledListener from "../order-canceled";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    version: 0,
    status: OrderStatus.Created,
    userId: "sdka2323",
  });

  await order.save();

  const data: OrderCanceledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "eke2dml2",
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("updates the status of the order", async () => {
  const { data, listener, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
