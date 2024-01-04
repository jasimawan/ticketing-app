import { Publisher, Subjects, OrderCreatedEvent } from "@jasimawan/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
