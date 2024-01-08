import { Listener, OrderCreatedEvent, Subjects } from "@jasimawan/common";
import { QUEUE_GROUP_NAME } from "./queue-group";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}

export default OrderCreatedListener;
