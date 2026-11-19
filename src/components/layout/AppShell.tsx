'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileHeader, MobileBottomNav } from '@/components/navigation/MobileNav';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTaskMutations } from '@/hooks/useTaskMutations';
import { CommandPalette } from '@/components/navigation/CommandPalette';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { createTask, isCreating } = useTaskMutations();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>

        <MobileBottomNav onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      </div>

      {/* Global Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule New Workout or Habit"
        description="Fill in workout details to add it to your FitPlan training schedule."
        size="lg"
      >
        <TaskForm
          onSubmit={async (data) => {
            await createTask({
              title: data.title,
              description: data.description || '',
              category: data.category,
              priority: data.priority,
              status: data.status,
              dueDate: data.dueDate,
              durationMinutes: data.durationMinutes ?? null,
              targetCalories: data.targetCalories ?? null,
            });
            setIsCreateModalOpen(false);
          }}
          isLoading={isCreating}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Global Command Palette */}
      <CommandPalette onOpenCreate={() => setIsCreateModalOpen(true)} />
    </div>
  );
}