import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

interface Conversation {
  id: number;
  title: string;
}

const Conversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchConversations = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/conversations?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setConversations(response.data.conversations);
      setTotalPages(response.data.pagination.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(currentPage);
  }, [currentPage]);

  const handleConversationClick = (id: number) => {
    navigate(`/conversations/${id}`);
  };

  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/conversations', { title: newConversationTitle }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setConversations((prev) => [...prev, response.data]);
      setNewConversationTitle('');
      setShowForm(false);
      fetchConversations(currentPage);
    } catch (error) {
      console.error('Erro ao criar nova conversa:', error);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Minhas Conversas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {showForm ? 'Cancelar' : 'Nova Conversa'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateConversation} className="mb-4 flex flex-col sm:flex-row">
          <input
            type="text"
            value={newConversationTitle}
            onChange={(e) => setNewConversationTitle(e.target.value)}
            placeholder="Título da nova conversa"
            required
            className="border border-gray-300 p-2 rounded-lg flex-grow mb-2 sm:mb-0 sm:mr-2"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-200">
            Criar
          </button>
        </form>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <ul className="space-y-4">
            {conversations.map((conversation) => (
              <li key={conversation.id} onClick={() => handleConversationClick(conversation.id)} className="cursor-pointer border p-4 rounded-lg hover:bg-gray-100">
                <h3 className="text-xl">{conversation.title}</h3>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-4">
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
              className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages} 
              className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Conversations;
