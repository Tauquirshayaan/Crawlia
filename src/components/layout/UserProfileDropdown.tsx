"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, CreditCard, Bell, Mail, Settings, ArrowLeftRight, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface UserProfileDropdownProps {
  userInitial: string;
  userEmail: string;
  userName?: string;
}

export function UserProfileDropdown({ userInitial, userEmail, userName }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Profile", href: "/dashboard/settings/profile", icon: User },
    { name: "Billing & plan", href: "/dashboard/settings/billing", icon: CreditCard },
    { name: "Mailboxes", href: "/dashboard/inboxes", icon: Mail },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--color-brand-border)] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] hover:bg-[var(--color-brand-canvas)] transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="h-px bg-[var(--color-brand-border)] my-2" />
          
          <div className="px-1">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] hover:bg-[var(--color-brand-canvas)] transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Switch account
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] hover:bg-[var(--color-brand-canvas)] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}

      {/* Profile Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--color-brand-canvas)] cursor-pointer transition-colors border border-transparent hover:border-[var(--color-brand-border)] select-none"
      >
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] text-sm flex items-center justify-center font-bold">
          {userInitial}
        </div>
        <div className="flex flex-col truncate flex-1 justify-center">
          <span className="text-sm font-bold text-[var(--color-brand-ink)] truncate leading-tight">
            {userName || userEmail.split('@')[0]}
          </span>
          <span className="text-[10px] font-medium text-[var(--color-brand-slate)] truncate leading-tight">
            {userEmail}
          </span>
        </div>
      </div>
    </div>
  );
}
