import { Publisher, Subjects, OrderCanceledEvent } from "@jasimawan/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
