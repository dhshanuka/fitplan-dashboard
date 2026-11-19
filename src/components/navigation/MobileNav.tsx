'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Flame, Sun, Moon, Plus } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export function MobileHeader({ onOpenCreateModal }: { onOpenCreateModal?: () => void }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-sm shadow-emerald-500/20">
          <Flame className="w-4 h-4 fill-slate-950 text-slate-950" />
        </div>
        <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
          FitPlan
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {onOpenCreateModal && (
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="p-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/30"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}

export function MobileBottomNav({ onOpenCreateModal }: { onOpenCreateModal?: () => void }) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      label: 'Workouts',
      href: '/tasks',
      icon: CheckSquare,
      active: pathname.startsWith('/tasks'),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-2 pb-safe shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors',
            pathname === '/'
              ? 'text-emerald-500 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        {/* Center Floating Action Button */}
        {onOpenCreateModal && (
          <button
            type="button"
            onClick={onOpenCreateModal}
            aria-label="Add workout"
            className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        <Link
          href="/tasks"
          className={cn(
            'flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-medium transition-colors',
            pathname.startsWith('/tasks')
              ? 'text-emerald-500 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          )}
        >
          <CheckSquare className="w-5 h-5" />
          <span>Workouts</span>
        </Link>
      </div>
    </nav>
  );
}

