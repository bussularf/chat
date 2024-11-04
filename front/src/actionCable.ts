import { createConsumer } from "@rails/actioncable";

const cable = createConsumer('wss://localhost:3000/cable');

type OnReceivedType = (data: any) => void;

export const createChatSubscription = (token: string, onReceived: OnReceivedType) => {
  return cable.subscriptions.create(
    { channel: 'ChatChannel' },
    {
      connected() {
        console.log('Conexão estabelecida');
      },
      disconnected() {
        console.log('Conexão encerrada');
      },
      received(data) {
        onReceived(data);
      },
      params: { token: token },
    }
  );
};
