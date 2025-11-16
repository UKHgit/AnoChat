// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage setUsername={setUsername} />} />
        <Route path="/chat/:roomId" element={<ChatRoom username={username} />} />
      </Routes>
    </Router>
  );
}

export default App;