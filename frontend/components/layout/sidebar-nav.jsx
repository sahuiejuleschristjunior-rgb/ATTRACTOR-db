'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Bot, LayoutDashboard, Settings, UsersRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Activity },
  { href: '/clients', label: 'Clients', icon: UsersRound },
  { href: '/automations', label: 'Automations', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-border bg-white px-4 py-4 md:h-screen md:w-64 md:border-b-0 md:border-r md:px-6 md:py-8">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-lg bg-primary" />
        <p className="text-base font-semibold text-foreground">Attractor CRM</p>
      </div>
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                active ? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
