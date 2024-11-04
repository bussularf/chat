import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
    setIsOpen(false);
  };

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {isLoggedIn ? (
          <Link to="/conversations" className="text-white text-lg font-bold">
            WeChat
          </Link>
        ) : (
          <span className="text-white text-lg font-bold cursor-not-allowed opacity-50">
            WeChat
          </span>
        )}
        <button
          className="text-white md:hidden"
          onClick={toggleMenu}
        >
          {isOpen ? '✖' : '☰'}
        </button>
        <div className={`hidden md:flex md:items-center md:space-x-4`}>
          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <Link 
                to="/profile" 
                className="text-white px-4 py-2 hover:bg-gray-700 rounded"
                onClick={handleMenuClick}
              >
                Perfil
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-white px-4 py-2 hover:bg-red-700 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} flex flex-col items-center`}>
        <div className="flex flex-col items-center space-y-2 mt-2">
          {isLoggedIn && (
            <>
              <Link 
                to="/profile" 
                className="text-white block px-4 py-2 hover:bg-gray-700 rounded"
                onClick={handleMenuClick}
              >
                Perfil
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-white block px-4 py-2 hover:bg-red-700 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;