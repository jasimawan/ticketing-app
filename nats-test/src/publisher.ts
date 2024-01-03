import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  try {
    console.log("Publisher connected to Nats.");

    const publisher = new TicketCreatedPublisher(stan);
    await publisher.publish({
      id: "dkdjdk22",
      title: "test ticket",
      price: 20,
    });
  } catch (e) {
    console.log(e);
  }
});
