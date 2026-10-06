import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Language } from '../types/plan';
import { translations } from '../translations';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  planTitle: string;
  currentLang: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  planTitle,
  currentLang,
  onConfirm,
  onCancel,
}) => {
  const t = translations[currentLang];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#0e0e12] border border-white/20 p-6 sm:p-8 font-mono shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-zinc-400 inline-block" />
            <span className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase">
              CONFIRM // PURGE
            </span>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-display font-light text-xl text-white uppercase tracking-wider mb-2">
          {t.deleteModal.title}
        </h3>

        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
          {t.deleteModal.message}
        </p>

        {planTitle && (
          <div className="p-3 bg-black/60 border border-white/10 text-xs text-zinc-300 font-mono line-clamp-2 mb-6">
            "{planTitle}"
          </div>
        )}

        <div className="flex items-center justify-end gap-4 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-zinc-400 hover:text-white uppercase tracking-[0.15em] transition-colors"
          >
            {t.deleteModal.cancelBtn}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 text-xs bg-zinc-200 hover:bg-white text-black font-semibold uppercase tracking-[0.15em] transition-colors"
          >
            {t.deleteModal.confirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
