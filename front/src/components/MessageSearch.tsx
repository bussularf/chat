import React, { useState } from 'react';
import { api } from '../api';
import { useTheme } from './ThemeContext';

interface Message {
  id: number;
  content: string;
  user_id: number;
  user: User;
}

interface User {
  id: number;
  email: string;
}

interface SearchProps {
  conversationId: number;
  onSearchResults: (messages: Message[]) => void;
}

const MessageSearch: React.FC<SearchProps> = ({ conversationId, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode } = useTheme();

  const handleSearch = async () => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages/search`, {
        params: { query: searchQuery },
      });
      onSearchResults(response.data);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  return (
    <div className="flex space-x-2 mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar mensagens..."
        className={`flex-grow border border-gray-300 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
        />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">
        Buscar
      </button>
    </div>
  );
};

export default MessageSearch;
