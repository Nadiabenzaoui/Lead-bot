import React, { createContext, useCallback, useContext, useState } from 'react';

interface Toast {
  id: number;
  message: string;
  type?: 'info' | 'success' | 'error';
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    setToasts(prev => {
      const id = Date.now();
      return [...prev, { id, message, type }];
    });
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(toast => (
          <button
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`min-w-[220px] px-3 py-2 rounded-md text-xs text-left shadow-lg border ${
              toast.type === 'error'
                ? 'bg-red-950/80 border-red-900 text-red-100'
                : toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-900 text-emerald-100'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-100'
            }`}
          >
            {toast.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

