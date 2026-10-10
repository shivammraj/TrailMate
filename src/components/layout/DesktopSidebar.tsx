'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Sparkles, User, Leaf } from 'lucide-react';

export function DesktopSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Missions', href: '/missions', icon: Compass },
    { name: 'Discover', href: '/discover', icon: Sparkles },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 glass-panel border-r border-[#ffffff14] z-50">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#2d7a4f] to-[#3a9b63] p-2 rounded-xl text-white">
            <Leaf size={24} />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight text-white">
            TrailMate <span className="text-[#52c27d]">AI</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#2d7a4f]/20 text-[#52c27d] border border-[#3a9b63]/30' 
                  : 'text-stone-400 hover:bg-white/5 hover:text-stone-200 border border-transparent'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="glass-panel-highlight rounded-xl p-4 text-center">
          <p className="text-xs text-stone-400 mb-2">Time outside today</p>
          <p className="font-mono text-xl text-[#fcd34d] font-bold">45m</p>
        </div>
      </div>
    </aside>
  );
}
