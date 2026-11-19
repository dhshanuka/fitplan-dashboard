'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, Calendar, Flame, AlertCircle } from 'lucide-react';
import { parseQuickAdd } from '@/lib/nlParser';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { CategoryBadge, PriorityBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/dateUtils';
import { Button } from '@/components/ui/Button';

export function QuickAddInput({ onCreated }: { onCreated?: () => void }) {
  const [text, setText] = useState('');
  const { createTask, isCreating } = useTaskMutations();

  const parsed = parseQuickAdd(text);
  const hasText = text.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await createTask({
      title: parsed.title,
      description: '',
      category: parsed.category,
      priority: parsed.priority,
      status: 'Todo',
      dueDate: parsed.dueDate,
      durationMinutes: 30,
      targetCalories: 200,
    });

    setText('');
    onCreated?.();
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-200">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Smart Quick Add: e.g. "Run 5km tomorrow high #cardio" or "Squats 5x5 friday #strength"'
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!text.trim() || isCreating}
            isLoading={isCreating}
            className="shrink-0 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Add</span>
          </Button>
        </div>

        {/* Live Parse Preview */}
        {hasText && (
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-slate-500 dark:text-slate-400 animate-in fade-in duration-150">
            <span className="font-semibold text-slate-400">Parsed:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              &quot;{parsed.title}&quot;
            </span>
            <CategoryBadge category={parsed.category} size="sm" />
            <PriorityBadge priority={parsed.priority} size="sm" />
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-300">
              <Calendar className="w-3 h-3 text-emerald-500" />
              {formatDate(parsed.dueDate)}
            </span>
          </div>
        )}
      </form>
    </div>
  );
}

