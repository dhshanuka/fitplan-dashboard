'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Sun,
  Moon,
  LayoutDashboard,
  CheckSquare,
  Flame,
  ArrowRight,
  X,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { CategoryBadge, StatusBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export function CommandPalette({ onOpenCreate }: { onOpenCreate: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Fetch all tasks for fast command search
  const { data: tasksData } = useQuery({
    queryKey: ['tasks', 'palette'],
    queryFn: () => taskService.getTasks({ limit: 50 }),
    enabled: isOpen,
  });

  const tasks = tasksData?.data || [];

  // Toggle on Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Filter items
  const filteredActions = useMemo(() => {
    const q = query.toLowerCase().trim();
    const actions = [
      {
        id: 'action-create',
        title: 'Schedule New Workout',
        subtitle: 'Add a new habit, routine or session',
        icon: Plus,
        category: 'Actions',
        perform: () => {
          setIsOpen(false);
          onOpenCreate();
        },
      },
      {
        id: 'action-theme',
        title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        subtitle: 'Toggle theme appearance',
        icon: theme === 'dark' ? Sun : Moon,
        category: 'Preferences',
        perform: () => {
          toggleTheme();
          setIsOpen(false);
        },
      },
      {
        id: 'action-dashboard',
        title: 'Go to Dashboard',
        subtitle: 'View streak, charts, and metrics',
        icon: LayoutDashboard,
        category: 'Navigation',
        perform: () => {
          router.push('/');
          setIsOpen(false);
        },
      },
      {
        id: 'action-tasks',
        title: 'Go to Workouts & Habits',
        subtitle: 'View full table and filters',
        icon: CheckSquare,
        category: 'Navigation',
        perform: () => {
          router.push('/tasks');
          setIsOpen(false);
        },
      },
    ];

    if (!q) return actions;
    return actions.filter(
      (a) => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
    );
  }, [query, theme, onOpenCreate, router, toggleTheme]);

  const matchedTasks = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [query, tasks]);

  const totalItems = filteredActions.length + matchedTasks.length;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % (totalItems || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredActions.length) {
        filteredActions[selectedIndex]?.perform();
      } else {
        const taskIndex = selectedIndex - filteredActions.length;
        const task = matchedTasks[taskIndex];
        if (task) {
          router.push(`/tasks/${task.id}`);
          setIsOpen(false);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-emerald-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, workout name, or habit..."
            autoFocus
            className="w-full bg-transparent border-none text-slate-900 dark:text-slate-100 text-sm sm:text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Actions
              </div>
              {filteredActions.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.perform}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors',
                      isSelected
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.subtitle}</p>
                      </div>
                    </div>
                    {isSelected && <ArrowRight className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Matched Tasks */}
          {matchedTasks.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Matching Workouts & Habits
              </div>
              {matchedTasks.map((t, idx) => {
                const itemIndex = filteredActions.length + idx;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      router.push(`/tasks/${t.id}`);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors',
                      isSelected
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{t.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <CategoryBadge category={t.category} size="sm" />
                          <StatusBadge status={t.status} size="sm" />
                        </div>
                      </div>
                    </div>
                    {isSelected && <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">
              No matching commands or workouts found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1 bg-white dark:bg-slate-800 rounded border">↑</kbd>{' '}
              <kbd className="px-1 bg-white dark:bg-slate-800 rounded border">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1 bg-white dark:bg-slate-800 rounded border">Enter</kbd> to select
            </span>
          </div>
          <span>
            <kbd className="px-1 bg-white dark:bg-slate-800 rounded border">Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

