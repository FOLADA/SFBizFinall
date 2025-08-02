'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, Mail, Bot, User, Sparkles } from 'lucide-react';

interface LiveChatProps {
  businessId: number;
  businessName: string;
  businessPhone?: string;
  businessEmail?: string;
  className?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'business' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export default function LiveChat({ 
  businessId,
  businessName, 
  businessPhone, 
  businessEmail, 
  className = "" 
}: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi! I'm your AI assistant for ${businessName}. How can I help you today? 🤖`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          business_id: businessId,
          history: messages.map(msg => ({
            sender: msg.sender,
            text: msg.text
          }))
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Fallback response
        const fallbackResponse: Message = {
          id: Date.now() + 1,
          text: "I'm having trouble processing your request right now. Please try again or contact us directly.",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackResponse]);
      }
    } catch (error) {
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm experiencing technical difficulties. Please try again or contact us directly.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (sender: string) => {
    switch (sender) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'ai':
        return <Bot className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getMessageStyle = (sender: string) => {
    switch (sender) {
      case 'user':
        return 'bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white';
      case 'ai':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-rose-500 to-fuchsia-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bot className="w-6 h-6" />
                    <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{businessName}</h3>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      AI Assistant
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      message.sender === 'user' 
                        ? 'bg-rose-500 text-white' 
                        : message.sender === 'ai'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {getMessageIcon(message.sender)}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white'
                          : message.sender === 'ai'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-500 disabled:opacity-50"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white rounded-lg hover:from-rose-600 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Contact Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-4"
          >
            {businessPhone && (
              <motion.a
                href={`tel:${businessPhone}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Call Now</span>
              </motion.a>
            )}
            {businessEmail && (
              <motion.a
                href={`mailto:${businessEmail}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Email</span>
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center relative"
      >
        <MessageCircle className="w-6 h-6" />
        {isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </motion.div>
        )}
      </motion.button>
    </div>
  );
} 