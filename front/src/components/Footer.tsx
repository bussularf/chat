import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} WeChat. Todos os direitos reservados.</p>
        <div className="mt-2">
          <a href="/sobre" className="text-gray-400 hover:text-white mx-2">Sobre</a>
          <a href="/contato" className="text-gray-400 hover:text-white mx-2">Contato</a>
          <a href="/privacidade" className="text-gray-400 hover:text-white mx-2">Política de Privacidade</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
