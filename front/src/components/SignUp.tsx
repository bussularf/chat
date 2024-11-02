import React, { useState } from 'react';
import { url } from '../api';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await url.post('/users', {
        user: { email, password, password_confirmation: passwordConfirmation }
      });
      console.log('Usuário criado com sucesso:', response.data);
      setSuccess(true);
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || 'Erro ao criar o usuário. Verifique os dados e tente novamente.');
      } else {
        setError('Erro de conexão. Tente novamente mais tarde.');
      }
      console.error('Erro:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Cadastro</h2>
        {success && (
          <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
            Usuário cadastrado com sucesso! 
            <button 
              className="text-blue-600 underline ml-2"
              onClick={() => navigate('/')} // Navega para a página inicial
            >
              Voltar para Home
            </button>
          </div>
        )}
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Confirme a Senha:</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
