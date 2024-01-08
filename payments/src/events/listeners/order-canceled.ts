import {
  Listener,
  OrderCanceledEvent,
  OrderStatus,
  Subjects,
} from "@jasimawan/common";
import { QUEUE_GROUP_NAME } from "./queue-group";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCanceledEvent["data"], msg: Message) {
    const { id, version } = data;
    const order = await Order.findByEvent({
      id,
      version,
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    order.set({ status: OrderStatus.Canceled });

    await order.save();

    msg.ack();
  }
}

export default OrderCanceledListener;
