import { Listener, OrderCanceledEvent, Subjects } from "@jasimawan/common";
import { QUEUE_GROUP_NAME } from "./queue-group";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers";

class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCanceledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    ticket.set({ orderId: undefined });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}

export default OrderCanceledListener;
