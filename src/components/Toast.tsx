import React from 'react';
import { X } from 'lucide-react';
import { ToastMessage } from '../types/plan';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-4 px-4 py-3 bg-[#121216] border border-white/25 text-white shadow-2xl text-xs font-mono tracking-wider uppercase animate-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 bg-white shrink-0" />
            <span className="text-zinc-200">{toast.text}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
