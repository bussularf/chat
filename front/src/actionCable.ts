import { createConsumer } from "@rails/actioncable";

const cable = createConsumer("ws://localhost:3000/cable");

export const createChatSubscription = (token: string, onReceived: (data: any) => void) => {
  const channel = cable.subscriptions.create(
    { channel: "ChatChannel", token: token },
    {
      received(data) {
        onReceived(data);
      }
    }
  );

  return channel;
};
