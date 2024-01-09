import {
  Listener,
  Subjects,
  OrderStatus,
  PaymentCreatedEvent,
} from "@jasimawan/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group";
import { Order } from "../../models";

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    order.set({ status: OrderStatus.Complete });

    await order.save();

    msg.ack();
  }
}

export default PaymentCreatedListener;
