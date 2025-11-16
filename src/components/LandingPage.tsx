// src/components/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  setUsername: (username: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setUsername }) => {
  const [inputUsername, setInputUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if URL has room ID from hash (hack.chat style: /#roomid)
    const hash = window.location.hash.slice(1);
    if (hash) {
      setRoomId(hash);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim() && roomId.trim()) {
      setIsLoading(true);
      setUsername(inputUsername.trim());
      // Use hash-based routing like hack.chat
      window.location.hash = roomId.trim();
      setTimeout(() => {
        navigate(`/chat/${roomId.trim()}`);
      }, 100);
    }
  };

  const generateRandomRoom = () => {
    const random = Math.random().toString(36).substring(2, 10);
    setRoomId(random);
  };

  return (
    <div className="landing-container">
      <div className="stars"></div>
      <div className="terminal-border">
        <div className="terminal-header">
          <span className="terminal-title">[ AnoChat by UKH v1.0 ]</span>
          <span className="terminal-controls">
            <span className="control-dot red"></span>
            <span className="control-dot yellow"></span>
            <span className="control-dot green"></span>
          </span>
        </div>
        
        <div className="terminal-content">
          <div className="glitch-text" data-text="AnoChat">
            AnoChat
          </div>
          <p className="subtitle">$ by UKH - Enter the void and connect with shadows</p>
          
          <form onSubmit={handleSubmit} className="landing-form">
            <div className="form-group">
              <label htmlFor="username" className="input-label">
                <span className="prompt">$</span> Enter your anonymous identity:
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter username..."
                maxLength={20}
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomId" className="input-label">
                <span className="prompt">$</span> Enter chatroom ID (private tunnel):
              </label>
              <div className="room-input-group">
                <input
                  type="text"
                  id="roomId"
                  placeholder="e.g., hacker-den-2k25"
                  maxLength={30}
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={generateRandomRoom}
                  className="random-button"
                  title="Generate random room ID"
                >
                  🎲
                </button>
              </div>
            </div>

            <div className="button-group">
              <button
                type="submit"
                disabled={isLoading || !inputUsername.trim() || !roomId.trim()}
                className="join-button"
              >
                {isLoading ? '[ CONNECTING... ]' : '[ ENTER CHATROOM ]'}
              </button>
            </div>
          </form>

          <div className="info-box">
            <p>⚡ Share your room ID to invite others</p>
            <p>🔒 No history stored • Anonymous • Real-time</p>
            <p>🛡️ Messages delivered peer-to-peer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
