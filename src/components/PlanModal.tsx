import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Plan, PlanCategory, Language } from '../types/plan';
import { translations } from '../translations';
import { formatDateISO } from '../utils/dateUtils';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: Omit<Plan, 'id' | 'createdAt'>, existingId?: string) => void;
  editingPlan: Plan | null;
  currentLang: Language;
}

const categoryKeys: PlanCategory[] = ['study', 'exam', 'project', 'meeting', 'personal', 'other'];

export const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlan,
  currentLang,
}) => {
  const t = translations[currentLang];

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<PlanCategory>('study');
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; date?: string; time?: string }>({});

  useEffect(() => {
    if (editingPlan) {
      setTitle(editingPlan.title);
      setDate(editingPlan.date);
      setTime(editingPlan.time || '12:00');
      setNote(editingPlan.note || '');
      setCategory(editingPlan.category || 'study');
      setCompleted(editingPlan.completed);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setTitle('');
      setDate(formatDateISO(tomorrow));
      setTime('14:00');
      setNote('');
      setCategory('study');
      setCompleted(false);
    }
    setErrors({});
  }, [editingPlan, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; date?: string; time?: string } = {};
    if (!title.trim()) {
      newErrors.title = t.modal.errTitle;
    }
    if (!date) {
      newErrors.date = t.modal.errDate;
    }
    if (!time) {
      newErrors.time = t.modal.errTime;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        title: title.trim(),
        date,
        time,
        note: note.trim(),
        category,
        completed,
      },
      editingPlan?.id
    );

    onClose();
  };

  const setDateOffset = (days: number) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    setDate(formatDateISO(target));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#0e0e12] border border-white/20 p-6 sm:p-8 relative shadow-2xl max-h-[90vh] flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-white inline-block" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-500">
              SYS // FORM_ENTRY
            </span>
            <span className="text-zinc-600">//</span>
            <h2 className="text-sm uppercase tracking-[0.2em] font-medium text-white">
              {editingPlan ? t.modal.editTitle : t.modal.addTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-6 pr-1 text-xs">
          {/* Plan Title */}
          <div>
            <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-2">
              {t.modal.titleLabel} <span className="text-zinc-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder={t.modal.titlePlaceholder}
              autoFocus
              className={`w-full px-4 py-3 bg-black/50 border text-sm text-white placeholder:text-zinc-600 focus:outline-hidden transition-all ${
                errors.title ? 'border-zinc-400' : 'border-white/15 focus:border-white'
              }`}
            />
            {errors.title && <p className="text-zinc-400 text-[10px] mt-1.5 uppercase tracking-wider">{errors.title}</p>}
          </div>

          {/* Quick Date Presets */}
          <div>
            <div className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase mb-2">
              {t.modal.quickPresets}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setDateOffset(0)}
                className="py-1.5 border border-white/10 hover:border-white/40 bg-white/5 text-zinc-300 text-[10px] uppercase tracking-wider transition-colors"
              >
                {t.modal.today}
              </button>
              <button
                type="button"
                onClick={() => setDateOffset(1)}
                className="py-1.5 border border-white/10 hover:border-white/40 bg-white/5 text-zinc-300 text-[10px] uppercase tracking-wider transition-colors"
              >
                {t.modal.tomorrow}
              </button>
              <button
                type="button"
                onClick={() => setDateOffset(3)}
                className="py-1.5 border border-white/10 hover:border-white/40 bg-white/5 text-zinc-300 text-[10px] uppercase tracking-wider transition-colors"
              >
                {t.modal.in3Days}
              </button>
              <button
                type="button"
                onClick={() => setDateOffset(7)}
                className="py-1.5 border border-white/10 hover:border-white/40 bg-white/5 text-zinc-300 text-[10px] uppercase tracking-wider transition-colors"
              >
                {t.modal.inWeek}
              </button>
            </div>
          </div>

          {/* Date and Time Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-2">
                {t.modal.dateLabel} <span className="text-zinc-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                }}
                className={`w-full px-3 py-2.5 bg-black/50 border text-xs text-white focus:outline-hidden transition-all ${
                  errors.date ? 'border-zinc-400' : 'border-white/15 focus:border-white'
                }`}
              />
              {errors.date && <p className="text-zinc-400 text-[10px] mt-1.5 uppercase tracking-wider">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-2">
                {t.modal.timeLabel} <span className="text-zinc-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
                }}
                className={`w-full px-3 py-2.5 bg-black/50 border text-xs text-white focus:outline-hidden transition-all ${
                  errors.time ? 'border-zinc-400' : 'border-white/15 focus:border-white'
                }`}
              />
              {errors.time && <p className="text-zinc-400 text-[10px] mt-1.5 uppercase tracking-wider">{errors.time}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-2">
              {t.modal.categoryLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categoryKeys.map((catKey) => {
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`px-3 py-2 border text-left text-[11px] uppercase tracking-wider transition-all ${
                      isSelected
                        ? 'bg-white text-black border-white font-semibold'
                        : 'bg-black/40 text-zinc-400 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {t.categories[catKey]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[11px] text-zinc-400 tracking-[0.2em] uppercase mb-2">
              {t.modal.noteLabel}
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.modal.notePlaceholder}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/15 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white transition-all resize-none font-mono"
            />
          </div>

          {/* Actions */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-400 hover:text-white uppercase tracking-[0.15em] transition-colors"
            >
              {t.modal.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-white text-black font-semibold hover:bg-zinc-200 uppercase tracking-[0.15em] transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              {t.modal.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
