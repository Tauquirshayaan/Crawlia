"use client";

import { useState, useRef, useEffect } from "react";
import { Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export function CreditsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [credits, setCredits] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch credits on mount (or use a global store)
  useEffect(() => {
    async function fetchCredits() {
      try {
        const res = await fetch("/api/billing/status");
        if (res.ok) {
          const data = await res.json();
          setCredits(data.credits?.balance || 0);
        }
      } catch (e) {
        console.error("Failed to fetch credits", e);
      }
    }
    fetchCredits();
  }, []);

  return (
    <div className="relative" ref={dropdownRef} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      {/* Trigger Button */}
      <div 
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-bold border border-green-200 shadow-sm cursor-pointer hover:bg-green-100 transition-colors" 
        title="Manage Credits"
      >
        <Sparkles className="w-4 h-4" />
        <span>{credits}</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Credits</h3>
          
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#66ca7a] rounded-full" 
                style={{ width: `${Math.min(100, (credits / 1000) * 100)}%` }} // Arbitrary max for progress bar
              />
            </div>
            <span className="text-sm font-bold text-gray-900">{credits}</span>
          </div>
          
          <p className="text-xs text-gray-500 font-medium mb-5">credits this month</p>
          
          <div className="flex items-center gap-2 mb-5">
            <Link href="/dashboard/settings/billing" className="flex-1">
              <button className="w-full py-2 bg-[#66ca7a] hover:bg-[#5bb86d] text-white text-sm font-bold rounded-xl transition-colors">
                Buy more
              </button>
            </Link>
            <Link href="/dashboard/settings/billing" className="flex-1">
              <button className="w-full py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl transition-colors">
                Upgrade plan
              </button>
            </Link>
          </div>
          
          <div className="border-t border-gray-100 pt-5">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#1e1e1e] hover:bg-black text-[#66ca7a] text-sm font-bold rounded-xl transition-colors">
              <div className="w-6 h-6 rounded-full bg-[#324f38] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-[#66ca7a]" />
              </div>
              Earn free credits
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
