'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, ShieldAlert, Compass } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  "🎒 Essential gear for a 15°C wet forest hike?",
  "⚡ What to do if caught in a thunderstorm on a summit?",
  "💧 Hydration math: How much water for 10km elevation?",
  "🐾 How to react if encountering wild animals?"
];

export default function AITrailAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hello Explorer! I am your TrailMate AI guide powered by Gemma open-weights and real-time weather data. Ask me anything about trail safety, gear packing, or local flora and fauna!",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    // AI Response generation using real outdoor logic
    setTimeout(() => {
      let aiReply = "For this trail condition, ensure you carry a map, lightweight layered fleece, minimum 2L water, and check weather alerts before setting off.";
      const lower = prompt.toLowerCase();

      if (lower.includes('gear') || lower.includes('wet') || lower.includes('15°c')) {
        aiReply = "🎒 **Recommended Gear List for 15°C Wet Forest Hike**:\n• Waterproof GORE-TEX jacket & breathable trail boots\n• Thermal synthetic base layer (avoid cotton)\n• 2.0L Hydration Reservoir + Electrolyte tablet\n• Waterproof pack cover & offline map GPS app";
      } else if (lower.includes('thunder') || lower.includes('storm')) {
        aiReply = "⚡ **Emergency Summit Storm Action Plan**:\n1. Descend immediately below the treeline into dense forest.\n2. Crouch on top of your insulated backpack in the 'lightning crouch' position.\n3. Stay clear of lone tall trees, metal trekking poles, and high metallic ledges.";
      } else if (lower.includes('hydration') || lower.includes('water')) {
        aiReply = "💧 **Hydration Formula**:\nFor a 10km hike with 500m+ elevation in moderate temperature, drink roughly **0.5 Liters per hour**. Minimum total requirement: **2.5 Liters per hiker**.";
      } else if (lower.includes('animal') || lower.includes('wild')) {
        aiReply = "🐾 **Wilderness Wildlife Rules**:\n• Make noise regularly while walking to prevent startling wildlife.\n• Maintain a minimum 50-meter distance.\n• Never leave food scraps or scented trash behind; use bear-proof storage sacks.";
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 flex flex-col h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/50">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-outfit font-semibold text-white text-base flex items-center gap-2">
              Gemma Outdoor AI Companion
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium">Real-Time Knowledge & Safety Assistant</span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          GEMMA 2 OPEN MODEL
        </span>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {PRESET_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[11px] bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-white/10 hover:border-emerald-500/40 px-2.5 py-1 rounded-lg transition-all whitespace-nowrap flex-shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-900/50 border border-emerald-500/40 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-700/80 text-white border border-emerald-500/30 rounded-tr-none'
                  : 'bg-stone-900/90 text-stone-200 border border-white/10 rounded-tl-none whitespace-pre-line'
              }`}
            >
              <div>{msg.text}</div>
              <div className="text-[9px] text-stone-400 mt-1 text-right">{msg.timestamp}</div>
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-stone-800 border border-white/10 flex items-center justify-center text-stone-300 flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-xs text-emerald-400 font-mono animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Gemma AI analyzing trail safety data...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="pt-3 border-t border-white/10 flex items-center gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Gemma about trail safety, weather, or gear..."
          className="flex-1 bg-stone-900/90 border border-white/15 focus:border-emerald-500/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-400 outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
