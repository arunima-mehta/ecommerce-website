import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const { token, backendUrl } = useContext(ShopContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    if (token) {
      const savedMessages = localStorage.getItem(`chat_history_${token}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, [token]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (token && messages.length > 0) {
      localStorage.setItem(`chat_history_${token}`, JSON.stringify(messages));
    }
  }, [messages, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Check if user is logged in
    if (!token) {
      const errorMessage = { type: 'bot', content: 'Please log in to use the chat feature.' };
      setMessages(prev => [...prev, { type: 'user', content: inputValue }, errorMessage]);
      setInputValue('');
      return;
    }

    // Add user message
    const userMessage = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      // Send to backend for processing
      const response = await axios.post(`${backendUrl}/api/chat/query`, {
        query: inputValue
      }, {
        headers: { 
          token: token,  // Using the same header format as your other API calls
          'Content-Type': 'application/json'
        }
      });

      // Add bot response
      const botMessage = { type: 'bot', content: response.data.message };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

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
            <div className="chat-header">
              <h3>Shopping Assistant</h3>
              <button onClick={() => setIsOpen(false)}>
                <Icon icon="mdi:close" />
              </button>
            </div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
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