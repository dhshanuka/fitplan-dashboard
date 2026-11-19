'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { StatusDistributionItem } from '@/types/api';
import { cn } from '@/lib/utils';

export interface StatusChartProps {
  data: StatusDistributionItem[];
  totalTasks: number;
  className?: string;
}

export function StatusChart({ data, totalTasks, className }: StatusChartProps) {
  const chartData = data.filter((d) => d.value > 0);

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between',
        className
      )}
    >
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Workout Status Breakdown
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Distribution of scheduled vs completed routines
        </p>
      </div>

      {/* Donut Chart Container */}
      <div className="relative h-56 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(val: number, name: string) => [`${val} tasks`, name]}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(51, 65, 85, 0.6)',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Pie
              data={chartData.length > 0 ? chartData : [{ name: 'None', value: 1, color: '#334155' }]}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {totalTasks}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workouts
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

