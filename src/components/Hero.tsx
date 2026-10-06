import React from 'react';
import { Plus, ArrowDownRight } from 'lucide-react';
import { Language } from '../types/plan';
import { translations } from '../translations';
import chromeSculptureImg from '../assets/images/hero_chrome_sculpture_1790659130959.jpg';

interface HeroProps {
  currentLang: Language;
  onOpenAddModal: () => void;
  onScrollToPlans: () => void;
  stats: {
    total: number;
    todayCount: number;
    completedCount: number;
  };
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onOpenAddModal,
  onScrollToPlans,
  stats,
}) => {
  const t = translations[currentLang];

  return (
    <section id="hero" className="relative pt-10 pb-16 sm:pt-14 sm:pb-24 overflow-hidden border-b border-white/10 bg-tech-grid">
      {/* Decorative technical coordinate elements & wireframe rings */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-zinc-600 tracking-[0.25em] uppercase pointer-events-none hidden lg:block">
        [COORD. 45° 18' N // TIME_SYNC.OK]
      </div>
      <div className="absolute top-6 right-6 font-mono text-[10px] text-zinc-600 tracking-[0.25em] uppercase pointer-events-none hidden lg:block">
        [INTERFACE // MONOCHROME V4.0]
      </div>

      {/* Decorative concentric thin circular lines */}
      <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full border border-white/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Technical Label Sequence: 01 / PLAN 02 / TRACK 03 / ORGANIZE 04 / REMINDER */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 font-mono text-[11px] text-zinc-500 tracking-[0.25em] uppercase mb-8 border-b border-white/10 pb-4">
          <span className="text-zinc-300 font-medium">01 / PLAN</span>
          <span className="text-zinc-600">—</span>
          <span>02 / TRACK</span>
          <span className="text-zinc-600">—</span>
          <span>03 / ORGANIZE</span>
          <span className="text-zinc-600">—</span>
          <span>04 / REMINDER</span>
        </div>

        {/* Asymmetrical Editorial Composition: Big Typography + 3D Liquid Chrome Sculpture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Huge Poster Typography */}
          <div className="lg:col-span-7 z-10">
            <div className="inline-flex items-center gap-2 mb-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
              <span className="w-1.5 h-1.5 bg-white" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="font-display font-light text-4xl sm:text-6xl md:text-7xl uppercase text-white tracking-[0.06em] leading-[0.95] mb-6 text-balance">
              {t.hero.title}
            </h1>

            <div className="h-px w-24 bg-white/30 mb-6" />

            <p className="text-sm sm:text-base text-zinc-400 font-light max-w-lg leading-relaxed mb-8 tracking-wide">
              {t.hero.subtitle}
            </p>

            {/* Action Buttons: Minimalist & Industrial */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-3 px-6 py-3.5 bg-white hover:bg-zinc-200 text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-all active:translate-y-px shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                <Plus className="w-4 h-4" />
                <span>{t.hero.addBtn}</span>
              </button>

              <button
                onClick={onScrollToPlans}
                className="flex items-center gap-3 px-6 py-3.5 bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-[0.2em] border border-white/20 hover:border-white transition-all active:translate-y-px"
              >
                <span>{t.hero.viewPlansBtn}</span>
                <ArrowDownRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Right Column: 3D Chrome Liquid Metal Object with Technical Wireframe Frame */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient metallic sheen behind sculpture */}
            <div className="absolute inset-0 bg-radial-[circle_at_center] from-white/10 via-white/5 to-transparent blur-2xl pointer-events-none" />

            {/* Technical wireframe overlay frame */}
            <div className="relative w-full max-w-[420px] aspect-square border border-white/15 bg-black/60 p-2 overflow-hidden shadow-2xl">
              {/* Corner crosshair markers */}
              <div className="absolute top-1.5 left-1.5 text-white/40 font-mono text-[9px] pointer-events-none">+</div>
              <div className="absolute top-1.5 right-1.5 text-white/40 font-mono text-[9px] pointer-events-none">+</div>
              <div className="absolute bottom-1.5 left-1.5 text-white/40 font-mono text-[9px] pointer-events-none">+</div>
              <div className="absolute bottom-1.5 right-1.5 text-white/40 font-mono text-[9px] pointer-events-none">+</div>

              {/* Technical SVG wireframe waves behind chrome metal */}
              <svg
                className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                viewBox="0 0 400 400"
                fill="none"
              >
                <path
                  d="M0 100 Q100 80, 200 120 T400 100 M0 150 Q100 130, 200 170 T400 150 M0 200 Q100 180, 200 220 T400 200 M0 250 Q100 230, 200 270 T400 250 M0 300 Q100 280, 200 320 T400 300"
                  stroke="white"
                  strokeWidth="0.75"
                />
                <circle cx="200" cy="200" r="140" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="200" y1="0" x2="200" y2="400" stroke="white" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="0.5" opacity="0.3" />
              </svg>

              {/* The high-res polished reflective silver chrome object */}
              <img
                src={chromeSculptureImg}
                alt="Futuristic chrome liquid metal sculpture"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-125 hover:scale-102 transition-transform duration-700 select-none pointer-events-none"
              />

              {/* Bottom technical label */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] text-zinc-400 tracking-widest uppercase bg-black/80 px-2.5 py-1 border border-white/10 backdrop-blur-xs">
                <span>OBJ // CHROME.REFLECTIVE</span>
                <span>STATUS // ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Data Stream Bar: 3 Minimalist Columns */}
        <div className="mt-14 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 font-mono">
          <div className="py-4 sm:py-0 sm:px-6 first:pl-0">
            <div className="text-[10px] text-zinc-500 tracking-[0.25em] uppercase mb-1">
              01 // {t.hero.statsTotal}
            </div>
            <div className="text-2xl font-light text-white font-mono-numbers">
              {String(stats.total).padStart(2, '0')}
            </div>
          </div>

          <div className="py-4 sm:py-0 sm:px-6">
            <div className="text-[10px] text-zinc-500 tracking-[0.25em] uppercase mb-1">
              02 // {t.hero.statsToday}
            </div>
            <div className="text-2xl font-light text-zinc-200 font-mono-numbers">
              {String(stats.todayCount).padStart(2, '0')}
            </div>
          </div>

          <div className="py-4 sm:py-0 sm:px-6">
            <div className="text-[10px] text-zinc-500 tracking-[0.25em] uppercase mb-1">
              03 // {t.hero.statsCompleted}
            </div>
            <div className="text-2xl font-light text-white font-mono-numbers">
              {String(stats.completedCount).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
