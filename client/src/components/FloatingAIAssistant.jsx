import React, { useState } from 'react';
import { Bot, MessageSquare, X, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { sendChatMessage } from '../services/apiService';

export default function FloatingAIAssistant({ village, riskMetrics, currentLang = 'mr' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Namaste Kisan Bhai! 🙏 I am Krishi Mitr AI (कृषि मित्र). How can I help your farm in ${village ? village.villageName : 'your village'} today? Ask me about seed varieties, how to grow any plant, or pest sprays!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    `🌱 How to grow Tomato?`,
    `🌾 Best seed for Cotton?`,
    `💰 How to earn ₹3 Lakh/acre?`,
    `🌱 Zero-cost Jeevamrut recipe?`,
    `🐛 Pest spray for Onion Thrips?`,
    `🛡️ PMFBY Insurance Claim process?`,
    `💧 Drip Irrigation 55% Subsidy?`,
    `🧮 Land Area: 1 Acre = Gunthas?`
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(query, village?.id);
      setMessages(prev => [...prev, { sender: 'bot', text: reply || 'Namaste! I am ready to help you with crop advice.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Namaste! I am ready to help you with your farm questions.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING AI ASSISTANT TRIGGER BUTTON (BOTTOM RIGHT) */}
      <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center space-x-2.5 transition-all transform hover:scale-105 active:scale-95 border-2 border-white/20 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-900 animate-ping" />
          </div>
          <span className="text-xs sm:text-sm font-black hidden sm:inline tracking-wide">
            Krishi Mitr AI Assistant
          </span>
          <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-black hidden sm:inline">
            AI Help
          </span>
        </button>
      </div>

      {/* 2. FLOATING CHAT POPUP DRAWER MODAL */}
      {isOpen && (
        <div className="fixed bottom-24 sm:bottom-20 right-3 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[520px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-black flex items-center gap-1.5">
                  Krishi Mitr AI Assistant
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-extrabold">Online</span>
                </h4>
                <p className="text-[11px] text-emerald-100 font-medium">Digital Farming Friend for {village ? village.villageName : 'Selected Village'}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2 bg-slate-50 flex items-center gap-1.5 overflow-x-auto text-xs border-b border-slate-200 scrollbar-none">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap min-h-[28px] cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-2xl text-xs font-medium leading-relaxed max-w-[85%] whitespace-pre-line shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none font-semibold'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-700" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 p-2.5 rounded-2xl w-fit border border-slate-200">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span className="font-bold">Krishi Mitr is drafting advice...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask AI (e.g. "How to grow Tomato?")...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim() || loading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
