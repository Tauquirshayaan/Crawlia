"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Reply, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: "reply",
      title: "New Interested Reply",
      description: "Sarah Jenkins from TechFlow responded positively.",
      time: "2m ago",
      icon: Reply,
      color: "text-emerald-500",
      bg: "bg-emerald-100",
      unread: true,
    },
    {
      id: 2,
      type: "campaign",
      title: "Campaign Completed",
      description: "Q3 Agency Outreach sequence has finished.",
      time: "1h ago",
      icon: CheckCircle2,
      color: "text-blue-500",
      bg: "bg-blue-100",
      unread: true,
    },
    {
      id: 3,
      type: "alert",
      title: "Mailbox Disconnected",
      description: "Please reconnect info@yourdomain.com",
      time: "3h ago",
      icon: AlertCircle,
      color: "text-rose-500",
      bg: "bg-rose-100",
      unread: false,
    },
    {
      id: 4,
      type: "ai",
      title: "AI Analysis Ready",
      description: "Audit for nexus-designs.co is complete.",
      time: "1d ago",
      icon: Sparkles,
      color: "text-[var(--color-brand-teal)]",
      bg: "bg-[var(--color-brand-pastel)]",
      unread: false,
    }
  ];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] transition-colors rounded-full hover:bg-black/5" 
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[var(--shadow-card)] border border-[var(--color-brand-border)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-[var(--color-brand-border)] flex items-center justify-between bg-slate-50/50">
            <h3 className="font-semibold text-[var(--color-brand-ink)]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-[var(--color-brand-teal)] font-medium cursor-pointer hover:underline">Mark all as read</span>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 border-b border-[var(--color-brand-border)] last:border-0 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-slate-50/30' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center ${notif.bg} ${notif.color}`}>
                  <notif.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`text-sm truncate ${notif.unread ? 'font-semibold text-[var(--color-brand-ink)]' : 'font-medium text-[var(--color-brand-slate)]'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{notif.description}</p>
                </div>
                {notif.unread && (
                  <div className="w-2 h-2 rounded-full bg-[var(--color-brand-teal)] mt-1 shrink-0"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-[var(--color-brand-border)] text-center bg-slate-50/50">
            <button className="text-xs font-medium text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
