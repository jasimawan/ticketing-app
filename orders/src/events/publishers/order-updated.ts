import { Publisher, Subjects, TicketUpdatedEvent } from "@jasimawan/common";

export class OrderUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
