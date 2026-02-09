import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ChatMessage, NavTab, User } from '../types';
import { Send, Phone, ArrowLeft, RefreshCw, Lock } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface ChatProps {
  navigate: (tab: NavTab) => void;
}

const Chat: React.FC<ChatProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showClassList, setShowClassList] = useState(false);
  const [classmates, setClassmates] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  // Gatekeeper: Check if profile is complete
  const isProfileIncomplete = user.rollNumber.startsWith('G-');

  // Initial Fetch
  useEffect(() => {
    if (isProfileIncomplete) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [msgs, users] = await Promise.all([
          api.getMessages(user.batch),
          api.getBatchUsers(user.batch)
        ]);
        setMessages(msgs);
        setClassmates(users);
      } catch (error) {
        console.error("Failed to load chat", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Poll for new messages every 3 seconds (Simulating Real-time)
    const interval = setInterval(async () => {
       const msgs = await api.getMessages(user.batch);
       setMessages(msgs);
    }, 3000);

    return () => clearInterval(interval);
  }, [user.batch, isProfileIncomplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderRoll: user.rollNumber,
      senderName: user.fullName,
      content: inputText,
      timestamp: new Date().toISOString(),
      batchId: user.batch
    };

    // Optimistic Update
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Persist
    await api.sendMessage(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isProfileIncomplete) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 space-y-6">
        <div className="bg-red-100 p-6 rounded-full text-red-500 shadow-xl shadow-red-100">
          <Lock size={48} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
          <p className="text-gray-500 max-w-xs mx-auto">
            To join your batch chat, you must verify your identity by adding your Roll Number, Level, and Term to your profile.
          </p>
        </div>
        <Button onClick={() => navigate(NavTab.PROFILE)} className="w-full max-w-xs">
          Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(NavTab.HOME)} 
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div onClick={() => setShowClassList(!showClassList)} className="cursor-pointer">
            <h2 className="font-bold text-gray-900 text-sm leading-tight">{user.batch} Group</h2>
            <p className="text-[10px] text-green-500 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              {classmates.length} members • Online
            </p>
          </div>
        </div>
        {/* Class List Toggle Indicator */}
        <div 
          onClick={() => setShowClassList(!showClassList)}
          className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors"
        >
          {showClassList ? 'Close' : 'Members'}
        </div>
      </div>

      {/* Class List Modal / Overlay */}
      {showClassList && (
        <div className="absolute inset-0 bg-white z-20 overflow-y-auto animate-in slide-in-from-top duration-300 pt-16 pb-20 px-4">
           <h3 className="font-bold text-lg mb-4 text-gray-800">Class List</h3>
           <div className="space-y-3">
             {classmates.map(mate => (
               <div key={mate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-3">
                   <img src={mate.profileImageUrl} alt="" className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                   <div>
                     <p className="font-semibold text-sm text-gray-900">{mate.fullName}</p>
                     <p className="text-xs text-gray-500">{mate.rollNumber}</p>
                   </div>
                 </div>
                 {mate.phoneNumber && (
                   <a href={`tel:${mate.phoneNumber}`} className="bg-green-100 text-green-600 p-2 rounded-full">
                     <Phone size={18} />
                   </a>
                 )}
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5]/30" // Subtle Whatsapp-like vibe
        ref={scrollRef}
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center pt-10 text-gray-400">
            <RefreshCw className="animate-spin" />
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRoll === user.rollNumber;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}
                >
                  {!isMe && <p className="text-[10px] font-bold text-orange-600 mb-0.5">{msg.senderName}</p>}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 sticky bottom-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-blue-900 text-white p-3 rounded-full hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;