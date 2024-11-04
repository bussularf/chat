import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { url } from '../api';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        alert('Você precisa estar logado para acessar esta página.');
        navigate('/users/sign_in');
        return;
      }
  
      try {
        const response = await url.get(`/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUser({
          name: response.data.name || '',
          email: response.data.email
        });
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        alert('Ocorreu um erro ao buscar os dados do usuário.');
      }
    };
  
    fetchUser();
  }, [navigate]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      name: user.name,
      email: user.email,
      currentPassword,
      newPassword
    };

    try {
      if (newPassword && newPassword !== confirmNewPassword) {
        alert('As novas senhas não coincidem.');
        return;
      }

      await url.patch('/users', userData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Perfil atualizado com sucesso!');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Ocorreu um erro ao atualizar o perfil.');
    }
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.')) {
      try {
        await url.delete('/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
      } catch (error) {
        console.error('Erro ao excluir conta:', error);
        alert('Ocorreu um erro ao excluir a conta.');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Editar Perfil</h1>
      <form onSubmit={handleEdit}>
        <div className="mb-4">
          <label className="block mb-1">Nome:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Senha Atual:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Nova Senha:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Confirme a Nova Senha:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Atualizar Perfil
        </button>
      </form>

      <button onClick={handleDeleteAccount} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
        Excluir Conta
      </button>
    </div>
  );
};

export default UserProfile;
