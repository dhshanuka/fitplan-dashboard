'use client';

import React from 'react';
import { Flame, Check, Zap, Target } from 'lucide-react';
import { WeeklyConsistencyDay } from '@/types/api';
import { cn } from '@/lib/utils';

export interface ConsistencyStreakProps {
  streakDays: number;
  weeklyDays: WeeklyConsistencyDay[];
  completionRate: number;
  className?: string;
}

export function ConsistencyStreak({
  streakDays,
  weeklyDays,
  completionRate,
  className,
}: ConsistencyStreakProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-5',
        className
      )}
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
              <Flame className="w-5 h-5 fill-amber-500" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {streakDays} Day Training Streak
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {completionRate}% Consistency
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Keep the momentum going by completing your scheduled routines today.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 py-1.5 px-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
          <Zap className="w-4 h-4 text-emerald-500" />
          <span>Weekly Target: 5+ workouts</span>
        </div>
      </div>

      {/* Weekday Visual Checkpoints (Mon - Sun) */}
      <div className="grid grid-cols-7 gap-2 pt-2">
        {weeklyDays.map((day) => {
          const isDone = day.completed > 0;
          return (
            <div
              key={day.date}
              className={cn(
                'flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center relative',
                day.isToday
                  ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
                  : isDone
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40'
              )}
            >
              {day.isToday && (
                <span className="absolute -top-2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500 text-slate-950">
                  Today
                </span>
              )}

              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {day.day}
              </span>

              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center mt-1.5 mb-1 text-xs font-bold transition-transform',
                  isDone
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/25'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                )}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : '·'}
              </div>

              <span className="text-[10px] text-slate-400">
                {day.completed > 0 ? `${day.completed} done` : `${day.total} set`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

