import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { url } from '../api';

const Otp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [qrCode, setQrCode] = useState(''); // Estado para armazenar o QR code

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await url.get('/enable_otp', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setQrCode(response.data.qr_code); // Armazena o QR code retornado
      } catch (err) {
        console.error('Erro ao buscar o QR code:', err);
        setError('Erro ao buscar o QR code.');
      }
    };

    fetchQrCode(); // Chama a função para buscar o QR code
  }, []);

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await url.post('/verify_otp', { 
        otp, 
        email 
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        setSuccess(true);
        navigate('/chat');
      } else {
        setError('Código OTP inválido.');
      }
    } catch (err) {
      setError('Erro ao verificar o código OTP.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Verificação OTP</h2>

      {/* Exibir QR code */}
      {qrCode && (
        <div className="mb-4">
          <p>Escaneie o QR code abaixo com seu aplicativo autenticador:</p>
          <img src={qrCode} alt="QR Code" className="mt-2" />
        </div>
      )}

      <form onSubmit={handleOtpSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Código OTP:</label>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            required 
            maxLength={6} // Limita a entrada a 6 caracteres
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Verificar OTP
        </button>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">OTP verificado com sucesso!</p>}
      </form>
    </div>
  );
};

export default Otp;
