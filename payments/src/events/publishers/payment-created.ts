import { Publisher, Subjects, PaymentCreatedEvent } from "@jasimawan/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
