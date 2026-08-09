import React, { useState } from 'react';
import { sendChatMessage } from '../services/apiService';
import { Bot, Send, User, RefreshCw, HeartHandshake } from 'lucide-react';

export default function KrishiMitrChat({ village, riskMetrics }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Namaste Kisan Bhai! 🙏 I am Krishi Mitr AI (कृषि मित्र). How are you doing on your farm today? Feel free to ask me anything about your crops, water, or just say hello!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    `😊 How are you today, Krishi Mitr?`,
    `☀️ Good Morning! How is weather in ${village?.villageName || 'village'}?`,
    `💰 How to earn ₹3 Lakh/acre net profit?`,
    `🌱 Zero-cost organic Jeevamrut formula & recipe?`,
    `📜 How to claim PMFBY crop insurance within 72 hours?`
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
      setMessages(prev => [...prev, { sender: 'bot', text: 'Namaste! I am doing great and ready to help you with your farm questions.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl mb-6 shadow-sm flex flex-col h-[560px]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-sm shrink-0">
            <Bot className="w-5 h-5 text-white font-bold" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              Krishi Mitr AI (कृषि मित्र)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">Online</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Conversational Digital Friend for {village ? village.villageName : 'Selected Village'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-xl text-xs font-extrabold shrink-0">
          <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Friendly AI</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2.5 flex items-center gap-2 overflow-x-auto text-xs border-b border-slate-100 scrollbar-none">
        <span className="text-slate-500 font-bold shrink-0 text-[11px]">Chat AI:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="shrink-0 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap min-h-[36px] cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-7 h-7 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-emerald-700" />
              </div>
            )}
            
            <div className="flex flex-col space-y-1 max-w-[88%] sm:max-w-xl">
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-xs whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white font-semibold rounded-br-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-slate-700" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 p-3 rounded-2xl w-fit border border-slate-200">
            <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
            <span className="font-bold">Krishi Mitr is drafting a warm response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="pt-2.5 border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          placeholder={`Chat with Krishi Mitr (e.g. "How are you?", "Good morning", crop tips)...`}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 min-h-[46px]"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || loading}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-50 min-h-[46px] shrink-0 shadow-sm cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
