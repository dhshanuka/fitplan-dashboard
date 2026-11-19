'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Plus,
  ArrowRight,
  TrendingUp,
  Dumbbell,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { StatCard } from '@/components/dashboard/StatCard';
import { ConsistencyStreak } from '@/components/dashboard/ConsistencyStreak';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { DueSoonList } from '@/components/dashboard/DueSoonList';
import { QuickAddInput } from '@/components/tasks/QuickAddInput';
import { CategoryBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCardSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DashboardPage() {
  const { data: stats, isLoading, isError, error, refetch } = useDashboardStats();

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="py-12">
        <ErrorState
          title="Dashboard Metrics Unavailable"
          message={error?.message || 'Failed to calculate fitness metrics. Simulated network failure may be active.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Fitness Dashboard
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {todayFormatted} • Ready to crush your wellness goals today?
          </p>
        </div>

        <Link href="/tasks">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <span>Manage All Workouts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Smart Quick-Add Bar */}
      <QuickAddInput onCreated={() => refetch()} />

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <StatCard
          label="Total Scheduled"
          value={stats.totalTasks}
          icon={<Activity className="w-5 h-5 text-emerald-500" />}
          subtitle="Workouts & healthy habits"
        />

        {/* Completed */}
        <StatCard
          label="Completed"
          value={stats.completedTasks}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          badge={{
            text: `${stats.completionRate}% Done`,
            variant: 'success',
          }}
          subtitle="Sessions finished"
        />

        {/* In Progress */}
        <StatCard
          label="In Progress"
          value={stats.inProgressTasks}
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          badge={{
            text: 'Active',
            variant: 'warning',
          }}
          subtitle="Currently underway"
        />

        {/* Overdue */}
        <StatCard
          label="Overdue"
          value={stats.overdueTasks}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          badge={{
            text: stats.overdueTasks > 0 ? `${stats.overdueTasks} Pending` : 'All Clear',
            variant: stats.overdueTasks > 0 ? 'danger' : 'info',
          }}
          subtitle={stats.overdueTasks > 0 ? 'Requires attention' : 'No overdue tasks'}
        />
      </div>

      {/* Weekly Consistency & Habit Streak Counter */}
      <ConsistencyStreak
        streakDays={stats.currentStreakDays}
        weeklyDays={stats.weeklyConsistency}
        completionRate={stats.completionRate}
      />

      {/* Charts Grid: 7-Day Trend + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={stats.completionTrend} />
        <StatusChart data={stats.statusDistribution} totalTasks={stats.totalTasks} />
      </div>

      {/* Bottom Grid: Due Soon List & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DueSoonList tasks={stats.dueSoon} />
        </div>

        {/* Category Breakdown Surface */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-500" />
              Category Balance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution of your training routines
            </p>
          </div>

          <div className="space-y-3">
            {stats.categoryDistribution.map((cat) => {
              const pct = stats.totalTasks > 0 ? Math.round((cat.count / stats.totalTasks) * 100) : 0;
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {cat.category}
                    </span>
                    <span className="text-slate-400">
                      {cat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-xs text-slate-400">
              Balanced routines optimize recovery and prevent burnout.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}