import { useState } from 'react';
import type { Lang } from '@/types';
import { LANG_LABELS, isRTL } from '@/types';
import { tr } from '@/lib/i18n';
import { Brain, ChevronLeft, ChevronRight } from 'lucide-react';

export function LanguageSelection({ onSelect }: { onSelect: (lang: Lang) => void }) {
  const [hovered, setHovered] = useState<Lang | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-2xl mb-4">
            <Brain className="w-9 h-9 text-teal-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            {tr('chooseLanguage', 'en')}
          </h1>
          <p className="text-slate-400 text-sm">VetRay — Veterinary Clinical Intelligence</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(LANG_LABELS) as Lang[]).map(lang => {
            const info = LANG_LABELS[lang];
            const isSelected = hovered === lang;
            return (
              <button
                key={lang}
                onClick={() => onSelect(lang)}
                onMouseEnter={() => setHovered(lang)}
                onMouseLeave={() => setHovered(null)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-teal-500/20 border-teal-400 scale-105'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-3xl">{info.flag}</span>
                <span className="text-white font-medium text-sm">{info.native}</span>
                <span className="text-slate-400 text-xs">{info.english}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-slate-500 text-xs">
          {tr('poweredBy', 'en')}
        </div>
      </div>
    </div>
  );
}
