// src/components/ChatRoom.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../firebase';
import { ref, push, set, update, onValue, remove, onChildAdded, off, get } from 'firebase/database';
import '../styles/ChatRoom.css';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: number;
  read: boolean;
  replyTo?: {
    username: string;
    text: string;
  };
}

interface User {
  id: string;
  username: string;
  lastSeen: number;
  isTyping: boolean;
}

const ChatRoom: React.FC<{ username: string }> = ({ username: initialUsername }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [username, setUsername] = useState(initialUsername || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [usersCollapsed, setUsersCollapsed] = useState(false);
  const [usersPinned, setUsersPinned] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userIdRef = useRef(Math.random().toString(36).substring(7));

  const roomRef = ref(database, `rooms/${roomId}`);
  const messagesRef = ref(database, `rooms/${roomId}/messages`);
  const usersRef = ref(database, `rooms/${roomId}/users`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize user
  useEffect(() => {
    if (!username) {
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
      } else {
        navigate('/');
      }
    }
  }, [username, navigate]);

  // Register user in room
  useEffect(() => {
    if (!username || !roomId) return;

    const userKey = userIdRef.current;
    const userPath = `${roomId}/users/${userKey}`;
    
    set(ref(database, userPath), {
      username,
      lastSeen: Date.now(),
      isTyping: false,
      joined: Date.now(),
    });

    localStorage.setItem('username', username);

    return () => {
      // Remove this user from the database first
      remove(ref(database, userPath)).then(() => {
        // After user is removed, check if room is empty
        setTimeout(async () => {
          try {
            const usersSnapshot = await get(ref(database, `rooms/${roomId}/users`));
            const usersData = usersSnapshot.val();
            
            // If no users left, delete ENTIRE room and ALL related data
            if (!usersData || Object.keys(usersData).length === 0) {
              await remove(ref(database, `rooms/${roomId}`));
              
              console.log(`🗑️🧹 COMPLETE DATABASE WIPE: Room "${roomId}" completely erased`);
              console.log(`   ✓ Room name: DELETED`);
              console.log(`   ✓ Messages: DELETED`);
              console.log(`   ✓ Users info: DELETED`);
              console.log(`   ✓ Lock status: DELETED`);
              console.log(`   ✓ All metadata: DELETED`);
              console.log(`   ✓ NOTHING LEFT TO TRACE`);
            } else {
              console.log(`ℹ️ Room "${roomId}" still has ${Object.keys(usersData).length} user(s). Not deleting.`);
            }
          } catch (error) {
            console.error('Error checking if room is empty:', error);
          }
        }, 300);
      }).catch((error) => {
        console.error('Error removing user from room:', error);
      });
    };
  }, [username, roomId]);

  // Listen to room lock status
  useEffect(() => {
    if (!roomId) return;

    const lockRef = ref(database, `${roomId}/locked`);
    const unsubscribe = onValue(lockRef, (snapshot) => {
      setIsRoomLocked(snapshot.val() || false);
    });

    return () => unsubscribe();
  }, [roomId]);

  // Listen to messages
  useEffect(() => {
    if (!roomId) return;

    const handleNewMessage = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        // Ensure timestamp is a valid number
        const timestamp = typeof data.timestamp === 'number' && data.timestamp > 0 
          ? data.timestamp 
          : Date.now();

        const newMessage: Message = {
          id: snapshot.key || '',
          ...data,
          timestamp, // Use validated timestamp
        };
        
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === newMessage.id);
          return exists ? prev : [...prev, newMessage];
        });

        // Mark as read after a short delay
        if (newMessage.username !== username) {
          setTimeout(() => {
            update(ref(database, `rooms/${roomId}/messages/${newMessage.id}`), {
              read: true,
            });
          }, 500);
        }
      }
    };

    onChildAdded(messagesRef, handleNewMessage);

    return () => {
      off(messagesRef, 'child_added', handleNewMessage);
    };
  }, [roomId, messagesRef, username]);

  // Listen to users
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.entries(data).map(([id, user]: any) => ({
          id,
          ...user,
        }));
        setUsers(usersList);
      }
    });

    return () => unsubscribe();
  }, [roomId, usersRef]);

  // Update user typing status
  const handleTyping = useCallback(() => {
    if (!roomId || !username) return;

    const userKey = userIdRef.current;
    update(ref(database, `rooms/${roomId}/users/${userKey}`), {
      isTyping: true,
      lastSeen: Date.now(),
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      update(ref(database, `rooms/${roomId}/users/${userKey}`), {
        isTyping: false,
      });
    }, 3000);
  }, [roomId, username]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isRoomLocked) return;
    if (!roomId || !username) return;

    try {
      // Stop typing indicator immediately
      const userKey = userIdRef.current;
      await update(ref(database, `rooms/${roomId}/users/${userKey}`), {
        isTyping: false,
      });

      // Prepare message with validated timestamp
      const messageData = {
        username,
        text: inputMessage.trim(),
        timestamp: Date.now(), // Always set fresh timestamp
        read: false,
        ...(replyingTo && {
          replyTo: {
            username: replyingTo.username,
            text: replyingTo.text,
          },
        }),
      };

      // Send message with error handling
      const messageRef = await push(messagesRef, messageData);
      
      if (messageRef.key) {
        console.log(`✓ Message sent successfully: ${messageRef.key}`);
        setInputMessage('');
        setReplyingTo(null);
      } else {
        throw new Error('Failed to get message key');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Show error to user but keep message in input for retry
      alert('❌ Failed to send message. Please try again.');
    }
  };

  const toggleRoomLock = async () => {
    if (!roomId) return;
    try {
      const newLockState = !isRoomLocked;
      await update(roomRef, { locked: newLockState });
      setIsRoomLocked(newLockState);
    } catch (error) {
      console.error('Error toggling room lock:', error);
    }
  };

  const clearChat = async () => {
    if (!roomId) return;
    if (window.confirm('🔥 Clear all messages? This cannot be undone!')) {
      try {
        await remove(messagesRef);
        setMessages([]);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  const leaveRoom = () => {
    if (window.confirm('Leave the chatroom?')) {
      navigate('/');
    }
  };

  const handleMessageClick = (message: Message) => {
    setReplyingTo(message);
  };

  return (
    <div className="chat-room">
      {/* Header */}
      <div className="chat-header">
        <div className="header-title">
          <span className="room-indicator">■</span>
          <span className="room-name">Room: {roomId}</span>
          {isRoomLocked && <span className="lock-indicator">🔒 LOCKED</span>}
        </div>
        <div className="header-controls">
          <button
            className={`header-button ${isRoomLocked ? 'locked' : ''}`}
            onClick={toggleRoomLock}
            title={isRoomLocked ? 'Unlock room' : 'Lock room'}
          >
            {isRoomLocked ? '🔒' : '🔓'}
          </button>
          <button
            className="header-button"
            onClick={clearChat}
            title="Clear all messages"
          >
            🗑️
          </button>
          <button
            className="header-button"
            onClick={leaveRoom}
            title="Leave room"
          >
            🚪
          </button>
        </div>
      </div>

      <div className="chat-main">
        {/* Messages Area */}
        <div className="messages-container">
          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>[ NO MESSAGES YET ]</p>
                <p>Start the conversation...</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-wrapper ${
                    message.username === username ? 'sent' : 'received'
                  }`}
                >
                  {message.replyTo && (
                    <div className="reply-preview">
                      <span className="reply-username">→ {message.replyTo.username}</span>
                      <span className="reply-text">{message.replyTo.text}</span>
                    </div>
                  )}
                  <div
                    className={`message ${
                      message.username === username ? 'own' : 'other'
                    }`}
                    onClick={() => handleMessageClick(message)}
                    title="Click to reply"
                  >
                    {message.username !== username && (
                      <div className="message-username">{message.username}</div>
                    )}
                    <div className="message-content">
                      <p>{message.text}</p>
                    </div>
                    <div className="message-footer">
                      <span className="message-time">
                        {(() => {
                          const date = new Date(message.timestamp);
                          // Check if date is valid
                          if (isNaN(date.getTime())) {
                            return 'Invalid time';
                          }
                          return date.toLocaleTimeString();
                        })()}
                      </span>
                      {message.username === username && (
                        <span className={`read-receipt ${message.read ? 'read' : 'sent'}`}>
                          {message.read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Typing Indicators */}
            {users
              .filter((u) => u.isTyping && u.username !== username)
              .map((user) => (
                <div key={user.id} className="typing-indicator">
                  <div className="typing-message">
                    <span className="typing-username">{user.username}</span>
                    <span className="typing-text"> is typing</span>
                    <span className="dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                </div>
              ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Users Sidebar */}
        <div
          className={`users-sidebar ${usersCollapsed ? 'collapsed' : ''} ${
            usersPinned ? 'pinned' : ''
          }`}
        >
          <div className="sidebar-header">
            <span className="sidebar-title">
              [ {users.length} ONLINE ]
            </span>
            <div className="sidebar-controls">
              <button
                className="sidebar-button"
                onClick={() => setUsersPinned(!usersPinned)}
                title={usersPinned ? 'Unpin' : 'Pin'}
              >
                {usersPinned ? '📌' : '📍'}
              </button>
              <button
                className="sidebar-button"
                onClick={() => setUsersCollapsed(!usersCollapsed)}
                title={usersCollapsed ? 'Expand' : 'Collapse'}
              >
                {usersCollapsed ? '▶' : '▼'}
              </button>
            </div>
          </div>

          {!usersCollapsed && (
            <div className="users-list">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`user-item ${
                    user.username === username ? 'self' : ''
                  }`}
                >
                  <span className={`status-dot ${user.isTyping ? 'typing' : 'online'}`}></span>
                  <span className="user-name">{user.username}</span>
                  {user.username === username && <span className="you-label">(YOU)</span>}
                  {user.isTyping && <span className="typing-label">typing...</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="chat-footer">
        {replyingTo && (
          <div className="reply-box">
            <div className="reply-info">
              <span>Replying to {replyingTo.username}</span>
              <button
                className="cancel-reply"
                onClick={() => setReplyingTo(null)}
              >
                ✕
              </button>
            </div>
            <p className="reply-preview-text">{replyingTo.text}</p>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="input-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSendMessage(e as any);
                }
              }}
              placeholder={
                isRoomLocked
                  ? '🔒 Room is locked...'
                  : 'Type your message... (Click message to reply)'
              }
              disabled={isRoomLocked}
              className="input-field"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isRoomLocked}
              className="send-button"
              title="Send message"
            >
              ⬆️
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
