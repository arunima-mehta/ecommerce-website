import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const { token, backendUrl } = useContext(ShopContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load all chats from localStorage when component mounts
  useEffect(() => {
    const savedChats = localStorage.getItem('all_chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id);
      }
    } else {
      // Create first chat if none exist
      createNewChat();
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('all_chats', JSON.stringify(chats));
    }
  }, [chats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentChatId, chats]);

  const createNewChat = () => {
    const newChat = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === currentChatId);
  };

  const updateChatTitle = (chatId, firstMessage) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId && chat.title === 'New Chat') {
        return {
          ...chat,
          title: firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage
        };
      }
      return chat;
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentChat = getCurrentChat();
    if (!currentChat) return;

    // Add user message
    const userMessage = { type: 'user', content: inputValue, timestamp: new Date().toISOString() };
    
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const newMessages = [...chat.messages, userMessage];
        // Update title with first message
        if (chat.messages.length === 0) {
          updateChatTitle(chat.id, inputValue);
        }
        return { ...chat, messages: newMessages };
      }
      return chat;
    }));

    const queryText = inputValue;
    setInputValue('');

    try {
      const requestBody = {
        query: queryText,
        sessionId: currentChat.sessionId
      };

      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers.token = token;
      }

      const response = await axios.post(`${backendUrl}/api/chat/query`, requestBody, { headers });

      // Add bot response
      const botMessage = { type: 'bot', content: response.data.message, timestamp: new Date().toISOString() };
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return { ...chat, messages: [...chat.messages, botMessage] };
        }
        return chat;
      }));
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = { type: 'bot', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date().toISOString() };
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return { ...chat, messages: [...chat.messages, errorMessage] };
        }
        return chat;
      }));
    }
  };

  const deleteChat = (chatId) => {
    setChats(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      if (filtered.length === 0) {
        // If deleting last chat, create a new one
        const newChat = {
          id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: 'New Chat',
          messages: [],
          createdAt: new Date().toISOString()
        };
        setCurrentChatId(newChat.id);
        return [newChat];
      }
      if (currentChatId === chatId) {
        setCurrentChatId(filtered[0].id);
      }
      return filtered;
    });
  };

  const currentChat = getCurrentChat();

  return (
    <div className="chat-widget-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="chat-window"
          >
            {/* Chat Sidebar */}
            <div className="chat-sidebar">
              <button className="new-chat-btn" onClick={createNewChat} title="New Chat">
                <Icon icon="mdi:message-plus-outline" width="20" height="20" />
                <span>New Chat</span>
              </button>
              <div className="chat-list">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    className={`chat-list-item ${chat.id === currentChatId ? 'active' : ''}`}
                    onClick={() => setCurrentChatId(chat.id)}
                  >
                    <Icon icon="mdi:message-text-outline" width="16" height="16" />
                    <span className="chat-title">{chat.title}</span>
                    <button
                      className="delete-chat-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      title="Delete chat"
                    >
                      <Icon icon="mdi:delete-outline" width="16" height="16" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Main Area */}
            <div className="chat-main">
              <div className="chat-header">
                <h3>Shopping Assistant</h3>
                <button onClick={() => setIsOpen(false)} title="Close">
                  <Icon icon="mdi:close" />
                </button>
              </div>
              <div className="chat-messages">
                {currentChat && currentChat.messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    {msg.content}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="chat-input">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                />
                <button type="submit">
                  <Icon icon="mdi:send" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon icon={isOpen ? "mdi:close" : "mdi:chat"} width="24" height="24" />
      </motion.button>
    </div>
  );
};

export default ChatWidget;