import { createConsumer } from "@rails/actioncable";

const cable = createConsumer('ws://localhost:3000/cable'); // ajuste a URL conforme necessário

type OnReceivedType = (data: any) => void; // Altere 'any' para um tipo mais específico, se possível

export const createChatSubscription = (token: string, onReceived: OnReceivedType) => {
  return cable.subscriptions.create(
    { channel: 'ChatChannel' }, // nome do canal que você está utilizando
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
      params: { token: token }, // Aqui você passa o token
    }
  );
};
