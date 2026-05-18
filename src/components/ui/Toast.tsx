import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

type ToastTone = 'success' | 'info' | 'error';

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (message: string, tone?: ToastTone) => void;
  dismiss: (id: string) => void;
}

const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  push: (message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    window.setTimeout(() => get().dismiss(id), 3400);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Imperatively raise a toast: `const toast = useToast(); toast('Saved!')`. */
export function useToast() {
  return useToastStore((s) => s.push);
}

const ICONS: Record<ToastTone, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
};

const TONE_STYLES: Record<ToastTone, string> = {
  success: 'text-risk-low',
  info: 'text-accent-blue',
  error: 'text-risk-high',
};

/** Renders the active toasts — mount once near the app root. */
export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 pt-safe">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.tone];
          return (
            <motion.button
              key={toast.id}
              layout
              onClick={() => dismiss(toast.id)}
              initial={{ opacity: 0, y: -24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="glass pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-line px-4 py-3 shadow-petal-lg"
            >
              <Icon size={20} className={cn('shrink-0', TONE_STYLES[toast.tone])} />
              <span className="text-start text-sm font-medium text-ink">{toast.message}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
