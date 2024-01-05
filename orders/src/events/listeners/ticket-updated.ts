import { Listener, Subjects, TicketUpdatedEvent } from "@jasimawan/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./queue-group";
import { Ticket } from "../../models";

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, price, title, version } = data;
    const ticket = await Ticket.findByEvent({ id, version });
    if (!ticket) {
      throw new Error("Ticket not found.");
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}

export default TicketUpdatedListener;
