import React from 'react';
import { cn } from '@/lib/utils';
import { TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { CATEGORY_COLORS, PRIORITY_COLORS, STATUS_COLORS } from '@/lib/constants';

interface BaseBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md';
}

export function Badge({ className, size = 'sm', children, ...props }: BaseBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide select-none',
        size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function CategoryBadge({ category, size = 'sm', className }: { category: TaskCategory; size?: 'sm' | 'md'; className?: string }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  return (
    <Badge size={size} className={cn(colors.bg, colors.text, colors.border, 'font-semibold', className)}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colors.accent }} />
      {category}
    </Badge>
  );
}

export function PriorityBadge({ priority, size = 'sm', className }: { priority: TaskPriority; size?: 'sm' | 'md'; className?: string }) {
  const colors = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Medium;
  return (
    <Badge size={size} className={cn(colors.bg, colors.text, 'border-transparent font-medium', className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', colors.dot)} />
      {priority}
    </Badge>
  );
}

export function StatusBadge({ status, size = 'sm', className }: { status: TaskStatus; size?: 'sm' | 'md'; className?: string }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Todo;
  return (
    <Badge size={size} className={cn(colors.bg, colors.text, 'border-transparent font-medium', className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', colors.dot)} />
      {status}
    </Badge>
  );
}

