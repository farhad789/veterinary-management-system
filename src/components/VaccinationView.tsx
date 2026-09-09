import { useState, useMemo } from 'react';
import type { Lang, Species, VaccinationSchedule } from '@/types';
import { isRTL } from '@/types';
import { tr } from '@/lib/i18n';
import { vaccinationSchedules } from '@/knowledge/vaccinationSchedules';
import { Syringe, AlertTriangle, Info, ChevronDown, Check } from 'lucide-react';

export function VaccinationView({ lang }: { lang: Lang }) {
  const [species, setSpecies] = useState<Species | ''>('');
  const dir = isRTL(lang) ? 'rtl' : 'ltr';

  const speciesOptions: Species[] = ['dog', 'cat', 'horse', 'cattle', 'sheep', 'goat', 'chicken', 'turkey'];

  const schedules = useMemo(() => {
    if (!species) return [];
    return vaccinationSchedules.filter(s => s.species === species);
  }, [species]);

  return (
    <div dir={dir} className="max-w-4xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Syringe className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-slate-800">{tr('vaccinationAssistant', lang)}</h3>
        </div>

        <label className="block text-sm font-medium text-slate-700 mb-2">{tr('selectSpecies', lang)}</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {speciesOptions.map(s => (
            <button
              key={s}
              onClick={() => setSpecies(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${species === s ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tr(s, lang)}
            </button>
          ))}
        </div>

        {!species && (
          <div className="text-center py-8 text-slate-400">
            <Syringe className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{tr('selectSpecies', lang)}</p>
          </div>
        )}

        {species && schedules.length === 0 && (
          <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-2">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">{tr('needMoreInfo', lang)}</p>
          </div>
        )}

        {schedules.length > 0 && (
          <>
            <div className="bg-blue-50 rounded-xl p-3 mb-4 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                {lang === 'fa'
                  ? 'این برنامه‌ها بر اساس شواهد علمی عمومی هستند. برای توصیه‌های محلی، با دامپزشک منطقه مشورت کنید.'
                  : 'These schedules are based on general scientific evidence. Consult a local veterinarian for region-specific recommendations.'}
              </p>
            </div>
            <div className="space-y-3">
              {schedules.map(s => (
                <VaccineCard key={s.id} schedule={s} lang={lang} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function VaccineCard({ schedule: s, lang }: { schedule: VaccinationSchedule; lang: Lang }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center justify-between text-left">
        <div className="flex-1">
          <p className="font-medium text-slate-800 text-sm">{lang === 'fa' ? s.vaccineNameFa : s.vaccineName}</p>
          <p className="text-xs text-slate-500 mt-0.5">{lang === 'fa' ? s.diseaseFa : s.disease}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.evidenceLevel === 'strong' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {s.evidenceLevel}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
          <Row label={lang === 'fa' ? 'اولین دوز' : 'First dose'} value={s.ageFirstDose} />
          <Row label={lang === 'fa' ? 'فاصله بوستر' : 'Booster interval'} value={s.boosterInterval} />
          <Row label={lang === 'fa' ? 'واکسیناسیون مجدد' : 'Revaccination'} value={s.revaccination} />
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-600">{lang === 'fa' ? s.notesFa : s.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-slate-500 flex-shrink-0">{label}</span>
      <span className="text-slate-800 font-medium text-right">{value}</span>
    </div>
  );
}
