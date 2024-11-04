import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { createChatSubscription } from '../actionCable';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import MessageSearch from './MessageSearch';
import { useTheme } from './ThemeContext';

interface User {
  id: number;
  email: string;
}

interface Message {
  id: number;
  content: string;
  user_id: number;
  user: User | null;
  userEmail?: string; 
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_messages: number;
}

interface ApiResponse {
  conversation: { id: number; title: string; created_at: string; updated_at: string };
  user: User;
  messages: Message[];
  pagination: Pagination;
}

const ConversationShow: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const conversationIdNumber = conversationId ? parseInt(conversationId, 10) : 0;
  const { darkMode } = useTheme();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [conversationTitle, setConversationTitle] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token') as string;

        const response = await api.get<ApiResponse>(`/conversations/${conversationIdNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: currentPage, per_page: 10 },
        });

        const data: ApiResponse = response.data;

        setConversationTitle(data.conversation.title);
        setMessages(
          data.messages.map((message) => ({
            ...message,
            userEmail: message.user ? message.user.email : 'Usuário desconhecido',
          }))
        );

        setCurrentUserId(data.user.id);
        setTotalPages(data.pagination.total_pages);

        const chatChannel = createChatSubscription(token, (data: { message: Message }) => {
          setMessages((prevMessages) => {
            if (!prevMessages.find((msg) => msg.id === data.message.id)) {
              return [
                ...prevMessages,
                {
                  ...data.message,
                  userEmail: data.message.user ? data.message.user.email : 'Usuário desconhecido',
                },
              ];
            }
            return prevMessages;
          });
        });

        return () => {
          chatChannel.unsubscribe();
        };
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [conversationIdNumber, currentPage]);

  const handleSearchResults = (searchResults: Message[]) => {
    setMessages(searchResults);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const token = localStorage.getItem('token') as string;

        if (editingMessageId) {
          const response = await api.put(`/conversations/${conversationIdNumber}/messages/${editingMessageId}`, 
          { content: newMessage },
          { headers: { Authorization: `Bearer ${token}` } });

          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              message.id === editingMessageId ? { ...message, content: newMessage } : message
            )
          );
          setEditingMessageId(null);
        } else {
          const response = await api.post(
            `/conversations/${conversationIdNumber}/messages`, 
            { content: newMessage, conversation_id: conversationIdNumber },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        
          const userEmail = response.data.email || "Email não disponível";
          const messageWithEmail = {
            ...response.data.message,
            userEmail: userEmail,
          };

          setMessages((prevMessages) => {
            const messageExists = prevMessages.some(msg => msg.id === messageWithEmail.id);
            
            if (!messageExists) {
              return [...prevMessages, messageWithEmail];
            }

            return prevMessages;
          });
        }
        setNewMessage('');
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

  const editMessage = (message: Message) => {
    setNewMessage(message.content);
    setEditingMessageId(message.id);
  };

  const deleteMessage = async (id: number) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('token') as string;

      await api.delete(`/conversations/${conversationIdNumber}/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`flex flex-col h-full p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-md`}>
      <h2 className="text-xl font-bold mb-4">{conversationTitle || 'Mensagens da Conversa'}</h2>
      <MessageSearch conversationId={conversationIdNumber} onSearchResults={handleSearchResults} />
      <div className="flex-grow overflow-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-center justify-between p-2 mb-2 rounded-lg shadow`}>
            <span>{message.content}</span>
            <span className="text-sm text-gray-500">{message.userEmail}</span>
            <div className="flex space-x-2">
              {message.user_id === currentUserId && (
                <>
                  <FaPencilAlt 
                    className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-700 transition duration-200" 
                    onClick={() => editMessage(message)} 
                  />
                  <FaTrash 
                    className={`h-5 w-5 cursor-pointer transition duration-200 ${isDeleting ? 'text-gray-400' : 'text-red-500 hover:text-red-700'}`} 
                    onClick={() => {
                      if (!isDeleting) deleteMessage(message.id);
                    }} 
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
          className={`flex-grow border border-gray-300 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">
          {editingMessageId ? 'Atualizar' : 'Enviar'}
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition duration-200"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition duration-200"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default ConversationShow;
