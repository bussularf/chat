import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { createChatSubscription } from '../actionCable';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

interface Message {
  id: number;
  content: string;
  user_id: number;
}

interface User {
  id: number;
  email: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/messages');
        setMessages(response.data.message);
        setCurrentUserId(response.data.user.id);
        
        // Chame o createChatSubscription aqui com o token e a função de callback
        const token = 'YOUR_ACCESS_TOKEN'; // Substitua isso pelo seu token de autenticação
        const chatChannel = createChatSubscription(token, (data: { message: Message }) => {
          setMessages((prevMessages) => {
            if (!prevMessages.find((msg) => msg.id === data.message.id)) {
              return [...prevMessages, data.message];
            }
            return prevMessages;
          });
        });
        
        // Não se esqueça de desconectar o canal ao desmontar o componente
        return () => {
          chatChannel.unsubscribe();
        };

      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };

    fetchMessages();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        if (editingMessageId) {
          const response = await api.put(`/messages/${editingMessageId}`, { content: newMessage });
          setMessages((prevMessages) =>
            prevMessages.map(message =>
              message.id === editingMessageId ? response.data : message
            )
          );
          setEditingMessageId(null);
        } else {
          const response = await api.post('/messages', { content: newMessage });
          setMessages((prevMessages) => [...prevMessages, response.data]);
        }
        setNewMessage('');
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }
    }
  };

  const editMessage = (message: Message) => {
    setNewMessage(message.content);
    setEditingMessageId(message.id);
  };

  const deleteMessage = async (id: number) => {
    try {
      await api.delete(`/messages/${id}`);
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="flex-grow overflow-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-center justify-between bg-white p-2 mb-2 rounded-lg shadow">
            <span>{message.content}</span>
            <div className="flex space-x-2">
              {message.user_id === currentUserId && (
                <>
                  <FaPencilAlt
                    className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-700 transition duration-200"
                    onClick={() => editMessage(message)}
                  />
                  <FaTrash
                    className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700 transition duration-200"
                    onClick={() => deleteMessage(message.id)}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem"
          required
          className="flex-grow border border-gray-300 p-2 rounded-lg"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">
          {editingMessageId ? 'Atualizar' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
