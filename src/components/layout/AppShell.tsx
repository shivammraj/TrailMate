'use client';

import React from 'react';
import BottomNavigation from './BottomNavigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SentryTraceDrawer from '@/components/debug/SentryTraceDrawer';
import { Compass, MapPin, Feather, Award, Settings, Sparkles } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home Base', href: '/', icon: Compass },
    { label: 'Discover Trails', href: '/discover', icon: MapPin },
    { label: 'Missions & XP', href: '/missions', icon: Award },
    { label: 'Profile', href: '/profile', icon: Feather },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#080d09] text-stone-100 selection:bg-emerald-500 selection:text-stone-950">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-card border-r border-white/10 p-6 fixed h-full z-40 bg-[#0c140d]/90">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-amber-700 p-0.5 shadow-lg shadow-emerald-950/50">
            <div className="w-full h-full bg-[#0c140d] rounded-[10px] flex items-center justify-center text-emerald-400 font-bold font-outfit text-xl">
              🌿
            </div>
          </div>
          <div>
            <h1 className="text-xl font-outfit font-extrabold text-white tracking-tight flex items-center gap-1.5">
              TrailMate <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">v2.0</span>
            </h1>
            <p className="text-[11px] text-stone-400 font-medium">Human Outdoor AI Companion</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-950/80 to-stone-900/80 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/40' 
                    : 'text-stone-400 hover:text-stone-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Real AI & Challenge Track Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-emerald-950/40 to-stone-950/80 border border-emerald-800/30 text-xs space-y-2 mb-4">
          <div className="flex items-center justify-between text-stone-300 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Real AI Engines
            </span>
            <span className="text-[10px] text-emerald-300 font-mono">ACTIVE</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            WeatherAPI • ElevenLabs Audio • TabPFN ML • Gemma Assistant
          </p>
        </div>

        <div className="mt-auto text-[11px] text-stone-500 text-center font-mono flex items-center justify-center gap-1">
          <span>Crafted for Outdoor Explorers</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-8 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <BottomNavigation />

      {/* Sentry Agent Telemetry Drawer */}
      <SentryTraceDrawer />
    </div>
  );
}
