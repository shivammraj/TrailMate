'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: '🌿' },
    { label: 'Missions', href: '/missions', icon: '🗺️' },
    { label: 'Discover', href: '/discover', icon: '🔍' },
    { label: 'Profile', href: '/profile', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 md:hidden z-50">
      <div className="flex justify-around items-center p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center flex-1">
              <span className={`text-2xl mb-1 ${isActive ? 'opacity-100 scale-110 transition-transform' : 'opacity-60'}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${isActive ? 'text-[#3a9b63]' : 'text-stone-400'}`}>
                {item.label}
              </span>
              {isActive && <div className="h-1 w-1 bg-[#3a9b63] rounded-full mt-1" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
