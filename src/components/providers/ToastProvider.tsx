'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'undo';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onUndo?: () => void;
  onRetry?: () => void;
}

interface ToastContextType {
  toast: {
    success: (message: string, options?: Partial<ToastItem>) => void;
    error: (message: string, options?: Partial<ToastItem>) => void;
    info: (message: string, options?: Partial<ToastItem>) => void;
    undo: (message: string, onUndo: () => void, options?: Partial<ToastItem>) => void;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, options?: Partial<ToastItem>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const duration = options?.duration ?? (type === 'undo' ? 7000 : 4000);

      const newToast: ToastItem = {
        id,
        type,
        message,
        duration,
        ...options,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const toastMethods = {
    success: (msg: string, opt?: Partial<ToastItem>) => addToast('success', msg, opt),
    error: (msg: string, opt?: Partial<ToastItem>) => addToast('error', msg, opt),
    info: (msg: string, opt?: Partial<ToastItem>) => addToast('info', msg, opt),
    undo: (msg: string, onUndo: () => void, opt?: Partial<ToastItem>) =>
      addToast('undo', msg, { onUndo, ...opt }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      {/* Toast viewport container */}
      <div
        role="region"
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md w-full px-4 sm:px-0 pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-xl border transition-all duration-300 animate-in slide-in-from-bottom-5',
              t.type === 'success' && 'bg-emerald-950/95 text-emerald-100 border-emerald-700/60 shadow-emerald-950/30',
              t.type === 'error' && 'bg-red-950/95 text-red-100 border-red-700/60 shadow-red-950/30',
              t.type === 'info' && 'bg-slate-900/95 text-slate-100 border-slate-700/60 shadow-slate-950/30',
              t.type === 'undo' && 'bg-zinc-900/95 text-zinc-100 border-zinc-700 shadow-zinc-950/40'
            )}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span className="mt-0.5 flex-shrink-0">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {t.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
                {t.type === 'undo' && <RotateCcw className="w-5 h-5 text-amber-400" />}
              </span>

              <div className="flex-1 min-w-0">
                {t.title && <p className="font-semibold text-xs tracking-wider uppercase opacity-80">{t.title}</p>}
                <p className="text-sm font-medium leading-snug break-words">{t.message}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {t.type === 'undo' && t.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    t.onUndo?.();
                    dismiss(t.id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  Undo
                </button>
              )}

              {t.onRetry && (
                <button
                  type="button"
                  onClick={() => {
                    t.onRetry?.();
                    dismiss(t.id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Retry
                </button>
              )}

              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Close notification"
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-white/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

