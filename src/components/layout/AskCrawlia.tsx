"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Sparkles, X, Send, Bot, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AskCrawlia() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Crawlia. I can help you find leads, write campaigns, or analyze websites. What would you like to do?" }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setMessages([...messages, { role: "user", content: query }]);
    setQuery("");
    
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm still in beta, but soon I'll be able to execute that command directly across your workspace!" 
      }]);
    }, 1000);
  };

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Drawer */}
      <div className={`relative h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300`}>
        {/* Header */}
        <div className="h-20 border-b border-[var(--color-brand-border)] flex items-center justify-between px-6 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-outfit font-bold text-lg text-[var(--color-brand-ink)] leading-tight">Ask Crawlia</h2>
              <p className="text-xs text-[var(--color-brand-slate)] font-medium">Your AI Sales Assistant</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-[var(--color-brand-slate)] hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' 
                  ? 'bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)]' 
                  : 'bg-slate-100 text-[var(--color-brand-slate)]'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${
                msg.role === 'assistant' 
                  ? 'bg-slate-50 text-[var(--color-brand-ink)] rounded-tl-sm border border-[var(--color-brand-border)]' 
                  : 'bg-[var(--color-brand-teal)] text-white rounded-tr-sm shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Quick Prompts - only show if just 1 message */}
          {messages.length === 1 && (
            <div className="pt-4 grid gap-2">
              <button 
                onClick={() => setQuery("Find digital agencies in London")}
                className="text-left px-4 py-3 rounded-xl border border-[var(--color-brand-border)] hover:border-[var(--color-brand-teal)] hover:bg-[var(--color-brand-pastel)]/30 transition-colors text-sm text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] flex items-center justify-between group"
              >
                "Find digital agencies in London"
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-brand-teal)]" />
              </button>
              <button 
                onClick={() => setQuery("Draft a follow-up for Acme Corp")}
                className="text-left px-4 py-3 rounded-xl border border-[var(--color-brand-border)] hover:border-[var(--color-brand-teal)] hover:bg-[var(--color-brand-pastel)]/30 transition-colors text-sm text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] flex items-center justify-between group"
              >
                "Draft a follow-up for Acme Corp"
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-brand-teal)]" />
              </button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[var(--color-brand-border)]">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Crawlia anything..." 
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-[var(--color-brand-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]/50 focus:border-[var(--color-brand-teal)] transition-all"
            />
            <button 
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2 p-2 rounded-lg bg-[var(--color-brand-teal)] text-white hover:bg-[var(--color-brand-emerald)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Powered by GPT-4o</span>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Button variant="ai" onClick={() => setIsOpen(true)}>
        <Sparkles className="w-3.5 h-3.5" />
        Ask Crawlia
      </Button>
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
