import { useState, useMemo } from 'react';
import type { Lang, DrugInfo, Species } from '@/types';
import { isRTL } from '@/types';
import { tr } from '@/lib/i18n';
import { drugDatabase } from '@/knowledge/drugDatabase';
import { Search, FlaskConical, ChevronDown, AlertTriangle, Info, Calculator } from 'lucide-react';

export function PharmacologyView({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<DrugInfo | null>(null);
  const [weight, setWeight] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const dir = isRTL(lang) ? 'rtl' : 'ltr';

  const filtered = useMemo(() => {
    if (!query) return drugDatabase;
    const q = query.toLowerCase();
    return drugDatabase.filter(d =>
      d.genericName.toLowerCase().includes(q) ||
      d.genericNameFa.includes(query) ||
      d.drugClass.toLowerCase().includes(q)
    );
  }, [query]);

  const calcDose = () => {
    if (!selectedDrug || !weight) return null;
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;
    const match = selectedDrug.doseMgPerKg.match(/(\d+\.?\d*)/);
    if (!match) return null;
    const dosePerKg = parseFloat(match[1]);
    return (dosePerKg * w).toFixed(2);
  };

  return (
    <div dir={dir} className="max-w-4xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-pink-600" />
          <h3 className="font-bold text-slate-800">{tr('drugReference', lang)}</h3>
        </div>

        <div className="relative mb-4">
          <Search className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={tr('searchDrug', lang)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 focus:bg-white transition"
          />
        </div>

        <div className="space-y-2">
          {filtered.map(d => (
            <button
              key={d.id}
              onClick={() => { setSelectedDrug(d); setShowCalculator(false); }}
              className={`w-full p-3 rounded-xl border text-left transition ${selectedDrug?.id === d.id ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
            >
              <p className="font-medium text-slate-800 text-sm">{lang === 'fa' ? d.genericNameFa : d.genericName}</p>
              <p className="text-xs text-slate-500 mt-0.5">{lang === 'fa' ? d.drugClassFa : d.drugClass}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedDrug && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">{lang === 'fa' ? selectedDrug.genericNameFa : selectedDrug.genericName}</h3>
              <p className="text-sm text-slate-500">{lang === 'fa' ? selectedDrug.drugClassFa : selectedDrug.drugClass}</p>
            </div>
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              {tr('drugCalculator', lang)}
            </button>
          </div>

          {showCalculator && (
            <div className="bg-teal-50 rounded-xl p-4 space-y-3">
              <label className="block text-sm font-medium text-slate-700">{tr('weight', lang)}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-400"
              />
              {calcDose() && (
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-500">{tr('calculateDose', lang)}</p>
                  <p className="text-2xl font-bold text-teal-700">{calcDose()} mg</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedDrug.doseMgPerKg} • {lang === 'fa' ? selectedDrug.routeFa : selectedDrug.route} • {lang === 'fa' ? selectedDrug.frequencyFa : selectedDrug.frequency}</p>
                </div>
              )}
              {!weight && (
                <p className="text-xs text-slate-400">{tr('weight', lang)} → {tr('calculateDose', lang)}</p>
              )}
              <div className="flex items-start gap-2 text-xs text-amber-700">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{tr('disclaimer', lang)}</p>
              </div>
            </div>
          )}

          <DrugSection label={tr('indication', lang)} value={lang === 'fa' ? selectedDrug.indicationFa : selectedDrug.indication} />
          <DrugSection label={tr('mechanism', lang)} value={lang === 'fa' ? selectedDrug.mechanismFa : selectedDrug.mechanism} />
          <DrugSection label={tr('drugClass', lang)} value={lang === 'fa' ? selectedDrug.drugClassFa : selectedDrug.drugClass} />
          <DrugSection label={tr('route', lang)} value={lang === 'fa' ? selectedDrug.routeFa : selectedDrug.route} />
          <DrugSection label={tr('frequency', lang)} value={lang === 'fa' ? selectedDrug.frequencyFa : selectedDrug.frequency} />
          <DrugSection label={tr('treatmentDuration', lang)} value={lang === 'fa' ? selectedDrug.durationFa : selectedDrug.duration} />
          <DrugSection label={tr('contraindications', lang)} value={lang === 'fa' ? selectedDrug.contraindicationsFa : selectedDrug.contraindications} warning />
          <DrugSection label={tr('adverseEffects', lang)} value={lang === 'fa' ? selectedDrug.adverseEffectsFa : selectedDrug.adverseEffects} warning />
          <DrugSection label={tr('interactions', lang)} value={lang === 'fa' ? selectedDrug.interactionsFa : selectedDrug.interactions} warning />
          {selectedDrug.withdrawalPeriod && (
            <DrugSection label={tr('withdrawalPeriod', lang)} value={lang === 'fa' ? selectedDrug.withdrawalPeriodFa! : selectedDrug.withdrawalPeriod} warning />
          )}
        </div>
      )}
    </div>
  );
}

function DrugSection({ label, value, warning }: { label: string; value: string; warning?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-2.5 flex items-center justify-between text-left">
        <span className={`text-sm font-medium ${warning ? 'text-amber-700' : 'text-slate-700'}`}>{label}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-3">
          <p className={`text-sm ${warning ? 'text-amber-700' : 'text-slate-600'}`}>{value}</p>
        </div>
      )}
    </div>
  );
}
