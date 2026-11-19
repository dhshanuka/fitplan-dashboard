'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Sun,
  Moon,
  Zap,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { taskService } from '@/services/taskService';
import { useToast } from '@/components/providers/ToastProvider';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [failureRate, setFailureRate] = useState(0.1);
  const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);

  useEffect(() => {
    taskService.getConfig().then((cfg) => {
      setFailureRate(cfg.mockFailureRate);
    }).catch(() => {});
  }, []);

  const handleToggleFailureRate = async () => {
    setIsUpdatingConfig(true);
    const nextRate = failureRate > 0 ? 0 : 0.15;
    try {
      const res = await taskService.updateConfig({ mockFailureRate: nextRate });
      setFailureRate(res.mockFailureRate);
      toast.info(
        res.mockFailureRate > 0
          ? `Simulated failure rate set to ${Math.round(res.mockFailureRate * 100)}%`
          : 'Simulated network failures disabled (0%)'
      );
    } catch {
      toast.error('Failed to update mock config');
    } finally {
      setIsUpdatingConfig(false);
    }
  };

  const navLinks = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      label: 'Workouts & Habits',
      href: '/tasks',
      icon: CheckSquare,
      active: pathname.startsWith('/tasks'),
    },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 select-none',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/80">
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-slate-950 text-slate-950" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                FitPlan
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Workout Tracker
              </span>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className={cn('px-3 mb-2', isCollapsed && 'hidden')}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </span>
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                link.active
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm shadow-emerald-500/5'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              )}
              title={isCollapsed ? link.label : undefined}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  link.active
                    ? 'text-emerald-500 dark:text-emerald-400'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                )}
              />
              {!isCollapsed && <span>{link.label}</span>}
              {!isCollapsed && link.active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Status / Failure Simulator & Theme Box */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Network Simulator Badge */}
        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Network Sim
              </span>
              <span
                className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase',
                  failureRate > 0
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                )}
              >
                {failureRate > 0 ? `${Math.round(failureRate * 100)}% Fail` : '0% Fail'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              Exercises error & retry toasts with 300-800ms latency.
            </p>

            <button
              type="button"
              onClick={handleToggleFailureRate}
              disabled={isUpdatingConfig}
              className="w-full py-1 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3 h-3" />
              {failureRate > 0 ? 'Disable Failures' : 'Enable ~15% Failures'}
            </button>
          </div>
        )}

        {/* Theme Toggle & Command Palette Hint */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="flex items-center gap-2.5 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors w-full justify-center"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                {!isCollapsed && <span>Light Theme</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
                {!isCollapsed && <span>Dark Theme</span>}
              </>
            )}
          </button>
        </div>

        {/* Command Palette Hint */}
        {!isCollapsed && (
          <div className="text-center pb-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Press{' '}
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                Ctrl+K
              </kbd>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

