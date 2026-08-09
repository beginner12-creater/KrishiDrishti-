import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw } from 'lucide-react';

export default function KrishiMitrChat({ village, riskMetrics }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Namaste! I am Krishi Mitr AI. I can answer your agricultural, sowing, water management, pest control, and PMFBY insurance questions for ${village ? village.villageName : 'your village'}. What would you like to ask today?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    `What crop should I plant if monsoon is delayed in ${village?.villageName}?`,
    `How to prevent Pink Bollworm / pest damage in ${village?.districtName}?`,
    `Groundwater is low in my block. What irrigation method is best?`,
    `How do I claim PMFBY insurance for unseasonal rainfall?`
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/krishi-mitr/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          villageId: village?.id
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply || 'I am ready to help you with crop advice.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to the advisory server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/80 mb-6 shadow-xl flex flex-col h-[520px]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shrink-0">
            <Bot className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-1.5">
              Krishi Mitr AI
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">Online</span>
            </h3>
            <p className="text-[11px] text-slate-400">Contextualized for {village ? village.villageName : 'Selected Village'}</p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2.5 flex items-center gap-2 overflow-x-auto text-xs border-b border-slate-800/60 scrollbar-none">
        <span className="text-slate-500 font-semibold shrink-0 text-[11px]">Ask AI:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="shrink-0 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1.5 rounded-xl text-[11px] transition-all max-w-xs truncate min-h-[36px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl text-xs sm:text-sm max-w-[85%] sm:max-w-md leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-medium rounded-br-none shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl w-fit">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Krishi Mitr is drafting localized response...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="pt-2.5 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder={`Ask Krishi Mitr about farming in ${village ? village.villageName : 'village'}...`}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || loading}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-50 min-h-[44px] shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
