/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shirt, LayoutDashboard, ListOrdered, PlusCircle, Settings, User as UserIcon, LogOut as LogOutIcon } from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfile } from './UserProfile';
import { Order } from '@/src/types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => Promise<void>;
  orders: Order[];
}

export function Layout({ children, activeTab, setActiveTab, user, onLogout, orders }: LayoutProps) {
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ListOrdered },
    { id: 'create', label: 'New Order', icon: PlusCircle },
  ];

  const handleProfileClick = () => {
    setIsSettingsMenuOpen(false);
    setIsProfileOpen(true);
  };

  const handleLogoutClick = async () => {
    setIsSettingsMenuOpen(false);
    await onLogout();
  };

  return (
    <div className="flex min-h-screen bg-transparent p-3 sm:p-4 lg:p-5">
      <aside className="relative hidden w-72 shrink-0 flex-col overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 shadow-xl lg:flex">
        <div className="absolute -right-24 -top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />

        <div className="relative border-b border-white/10 p-6">
          <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <span className="rounded-lg bg-white/10 p-2">
              <Shirt className="h-4 w-4 text-emerald-200" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Laundry Suite</p>
              <h1 className="text-lg font-semibold">DryClean Pro</h1>
            </div>
          </div>
          <p className="text-xs text-slate-300/85">Track every order from intake to delivery with confidence.</p>
        </div>

        <nav className="relative flex flex-1 flex-col px-4 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === item.id
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <button
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                isSettingsMenuOpen
                  ? 'bg-white/15 text-white'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
            {isSettingsMenuOpen && (
              <div className="absolute bottom-28 left-4 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
                <button
                  onClick={handleProfileClick}
                  className="group flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left text-sm text-foreground transition hover:bg-muted"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span>My Profile</span>
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="group flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-destructive transition hover:bg-red-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <LogOutIcon className="h-4 w-4" />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="relative m-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
          <p className="font-semibold text-white">Today's focus</p>
          <p className="mt-1 text-slate-300">Prioritize ready orders to keep pickup queue smooth.</p>
        </div>
      </aside>

      <section className="flex-1 overflow-auto rounded-3xl border border-border/70 bg-white p-4 shadow-lg sm:p-6 lg:p-8">
        {children}
      </section>

      {/* Profile Modal */}
      <UserProfile
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={onLogout}
        orders={orders}
      />

      <nav className="fixed bottom-0 left-0 right-0 z-10 flex h-16 items-center justify-around border-t border-border bg-white/95 px-4 backdrop-blur lg:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition ${
              activeTab === item.id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
