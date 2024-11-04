import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Otp from './components/Otp';
import Conversations from './components/Conversation';
import ConversationShow from './components/ConversationShow';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';
import { ThemeProvider, useTheme } from './components/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

const AppContent: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/conversations/:conversationId" element={<ConversationShow />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
