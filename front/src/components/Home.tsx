import React from 'react';
import Login from './Login';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-8">
      <div className="w-full md:w-1/2 mb-4 md:mb-0"> {/* Ajuste na largura e margem */}
        <h1 className="text-2xl font-bold">Bem-vindo ao Chat Real Time</h1>
        <p className="mt-4">
          Esta é uma aplicação de chat em tempo real que permite que você se conecte com amigos e compartilhe mensagens instantaneamente.
        </p>
        <p className="mt-2">
          Para começar, faça login ou crie uma conta.
        </p>
      </div>
      <div className="w-full md:w-1/2"> {/* Ajuste na largura */}
        <Login />
      </div>
    </div>
  );
};

export default Home;
