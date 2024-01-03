import { Publisher, Subjects, TicketUpdatedEvent } from "@jasimawan/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
