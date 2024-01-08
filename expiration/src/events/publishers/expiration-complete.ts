import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@jasimawan/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
