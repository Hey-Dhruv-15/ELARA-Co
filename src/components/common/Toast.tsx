import React from 'react';
import { useToast, ToastType } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-elara-accent-light dark:text-elara-accent-dark shrink-0" />;
    }
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 dark:bg-elara-card-dark/95 backdrop-blur-md rounded-xl border border-elara-border-light dark:border-elara-border-dark shadow-soft-hover dark:shadow-dark-hover animate-slide-up transition-all"
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light">
                {toast.title}
              </h4>
            )}
            <p className="text-sm text-elara-text-muted dark:text-elara-text-muted-dark mt-0.5 leading-snug break-words">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-elara-text-muted hover:text-elara-text-dark dark:text-elara-text-muted-dark dark:hover:text-elara-text-light transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

