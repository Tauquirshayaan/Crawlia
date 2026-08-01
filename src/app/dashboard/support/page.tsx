"use client";

import { useState } from "react";
import { MessageSquare, Send, Paperclip, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SupportPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "agent",
      content: "Hi there! I'm Sarah from Crawlia Support. How can I help you today?",
      time: "10:23 AM"
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMsg = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");

    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "agent",
        content: "Thanks for reaching out! A support engineer will review your request and get back to you shortly. Our current average response time is ~15 minutes.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-[var(--color-brand-border)] shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-pastel)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] flex items-center justify-center text-white shadow-sm">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="font-bold font-outfit text-[var(--color-brand-ink)]">Priority Support</h1>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-brand-emerald)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              We usually reply in 15 mins
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm">
          View Past Tickets
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-[var(--color-brand-slate)] text-white' : 'bg-[var(--color-brand-emerald)] text-white'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--color-brand-ink)] text-white rounded-tr-sm' : 'bg-white border border-[var(--color-brand-border)] text-[var(--color-brand-ink)] rounded-tl-sm shadow-sm'}`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-[var(--color-brand-muted)] mt-1 font-medium px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[var(--color-brand-border)] bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <button type="button" className="p-2 text-[var(--color-brand-muted)] hover:text-[var(--color-brand-slate)] transition-colors rounded-full hover:bg-slate-100">
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your issue..." 
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-emerald)]/50 focus:border-[var(--color-brand-emerald)] transition-all"
          />
          <Button type="submit" variant="primary" disabled={!inputValue.trim()}>
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
