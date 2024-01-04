import { Publisher, Subjects, TicketCreatedEvent } from "@jasimawan/common";

export class OrderCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
