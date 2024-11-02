import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Ou ajuste o caminho conforme necessário
    setIsOpen(false); // Fecha o menu após o logout
  };

  const handleMenuClick = () => {
    setIsOpen(false); // Fecha o menu ao clicar em qualquer item
  };

  const isLoggedIn = !!localStorage.getItem('token'); // Verifica se há um token

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          WeChat
        </Link>
        <button
          className="text-white md:hidden"
          onClick={toggleMenu}
        >
          {isOpen ? '✖' : '☰'}
        </button>
        <div className={`hidden md:flex md:items-center md:space-x-4`}>
          <Link to="/" className="text-white px-4 py-2 hover:bg-gray-700 rounded" onClick={handleMenuClick}>Home</Link>
          <Link to="/sobre" className="text-white px-4 py-2 hover:bg-gray-700 rounded" onClick={handleMenuClick}>Sobre</Link>
          <Link to="/servicos" className="text-white px-4 py-2 hover:bg-gray-700 rounded" onClick={handleMenuClick}>Serviços</Link>
          <Link to="/contato" className="text-white px-4 py-2 hover:bg-gray-700 rounded" onClick={handleMenuClick}>Contato</Link>
          {isLoggedIn && (
            <button 
              onClick={handleLogout} 
              className="text-white px-4 py-2 hover:bg-red-700 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col space-y-2 mt-2">
          <Link to="/" className="text-white block px-4 py-2 hover:bg-gray-700 rounded" onClick={handleMenuClick}>Home</Link>
          <Link to="/sobre" className="text-white block px-4 py-2 hover:bg-gray-700 rounded" onClick={handleMenuClick}>Sobre</Link>
          <Link to="/servicos" className="text-white block px-4 py-2 hover:bg-gray-700 rounded" onClick={handleMenuClick}>Serviços</Link>
          <Link to="/contato" className="text-white block px-4 py-2 hover:bg-gray-700 rounded" onClick={handleMenuClick}>Contato</Link>
          {isLoggedIn && (
            <button 
              onClick={handleLogout} 
              className="text-white block px-4 py-2 hover:bg-red-700 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
