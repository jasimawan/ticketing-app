import { Listener, OrderCreatedEvent, Subjects } from "@jasimawan/common";
import { QUEUE_GROUP_NAME } from "./queue-group";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting for job to be processed after ${delay} ms`);
    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}

export default OrderCreatedListener;
