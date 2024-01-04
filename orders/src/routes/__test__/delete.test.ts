import request from "supertest";
import app from "../../app";
import { Order, Ticket } from "../../models";
import { OrderStatus } from "@jasimawan/common";

it("marks an order as canceled", async () => {
  const ticket = Ticket.build({ title: "Test ticket", price: 20 });
  await ticket.save();

  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});
