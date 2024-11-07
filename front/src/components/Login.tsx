import React, { useState } from 'react';
import { url } from '../api';
import { Link, useNavigate } from 'react-router-dom';

interface DoorkeeperCredentials {
  client_id: string;
  client_secret: string;
}


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const credentialsResponse = await url.get('doorkeeper_credentials');
      const credentials: DoorkeeperCredentials = credentialsResponse.data;
  
      const { client_id, client_secret } = credentials;
  
      if (!client_id || !client_secret) {
        setError('Client ID e Client Secret não puderam ser carregados.');
        return;
      }
  
      const response = await url.post('/oauth/token', {
        grant_type: 'password',
        username: email,
        password: password,
        client_id,
        client_secret,
      });
  
      const { access_token } = response.data;
      navigate('/otp', { state: { access_token, email } });
    } catch (err: any) {
      setError('Login falhou. Verifique suas credenciais.');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl text-black font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Entrar
        </button>
      </form>
      <p className="mt-4">
        Não tem uma conta? <Link to="/signup" className="text-blue-500">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default Login;
