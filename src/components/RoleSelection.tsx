import type { Lang, UserRole } from '@/types';
import { USER_ROLES, isRTL } from '@/types';
import { tr, trRole } from '@/lib/i18n';
import { Brain, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export function RoleSelection({ lang, onSelect, onSkip }: { lang: Lang; onSelect: (role: UserRole) => void; onSkip: () => void }) {
  const dir = isRTL(lang) ? 'rtl' : 'ltr';
  const ForwardIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-500/20 rounded-2xl mb-3">
            <Brain className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">{tr('selectRole', lang)}</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {USER_ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-400 rounded-2xl transition-all group"
            >
              <span className="text-3xl">{role.icon}</span>
              <span className="text-slate-300 group-hover:text-white text-sm font-medium text-center">{trRole(role.id, lang)}</span>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button onClick={onSkip} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mx-auto transition">
            {tr('skipForNow', lang)} <ForwardIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
