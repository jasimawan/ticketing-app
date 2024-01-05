import { Listener, Subjects, TicketCreatedEvent } from "@jasimawan/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group";
import { Ticket } from "../../models";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });

    await ticket.save();

    msg.ack();
  }
}

export default TicketCreatedListener;
