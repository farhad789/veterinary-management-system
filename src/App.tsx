import { useState, useMemo, useCallback } from 'react';
import {
  Brain, Home, FlaskConical, TreePine, AlertTriangle, ClipboardList,
  Plus, Check, X, ChevronRight, ChevronDown, ChevronLeft, FileText,
  Activity, Shield, Lightbulb, PawPrint, Stethoscope, Zap, ListTree,
  RotateCcw, Play, CheckCircle2, XCircle, Info, Menu, Sparkles,
  ArrowLeft, ArrowRight, Syringe, Microscope, Settings,
} from 'lucide-react';
import type {
  ClinicalInput, Species, ReasoningOutput, HypothesisResult,
  ReasoningTreeNode, Lang, SampleCase, UserRole,
} from '@/types';
import { isRTL } from '@/types';
import { runReasoning } from '@/engine/reasoningEngine';
import { runAllTests, type TestResult } from '@/engine/tests';
import { clinicalSigns } from '@/knowledge/clinicalSigns';
import { sampleCases } from '@/knowledge/sampleCases';
import { tr } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { LanguageSelection } from '@/components/LanguageSelection';
import { AuthScreen } from '@/components/AuthScreen';
import { RoleSelection } from '@/components/RoleSelection';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard, type View } from '@/components/Dashboard';
import { VaccinationView } from '@/components/VaccinationView';
import { PharmacologyView } from '@/components/PharmacologyView';

type Phase = 'language' | 'landing' | 'auth' | 'role' | 'app';

export default function App() {
  const { user, loading, signOut, updateProfile, ensureProfile } = useAuth();
  const [lang, setLang] = useState<Lang>('fa');
  const [phase, setPhase] = useState<Phase>('language');
  const [view, setView] = useState<View>('home');
  const [input, setInput] = useState<ClinicalInput | null>(null);
  const [output, setOutput] = useState<ReasoningOutput | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dir = isRTL(lang) ? 'rtl' : 'ltr';

  // Auto-advance phase based on auth state
  const effectivePhase: Phase = (() => {
    if (loading) return phase;
    if (phase === 'language' || phase === 'landing' || phase === 'auth') {
      if (user) {
        return user.role === null ? 'role' : 'app';
      }
      return phase;
    }
    if (phase === 'role') {
      if (!user) return 'landing';
      return user.role ? 'app' : 'role';
    }
    return 'app';
  })();

  const handleLanguageSelect = (l: Lang) => {
    setLang(l);
    setPhase('landing');
  };

  const handleAuthSuccess = async () => {
    await ensureProfile(lang);
    setPhase('role');
  };

  const handleRoleSelect = async (role: UserRole) => {
    await updateProfile({ role });
    setPhase('app');
    setView('home');
  };

  const handleSignOut = async () => {
    await signOut();
    setPhase('landing');
    setView('home');
  };

  const handleRun = useCallback((data: ClinicalInput) => {
    setInput(data);
    setOutput(runReasoning(data));
    setView('reasoning');
  }, []);

  // ---- Phase: Loading ----
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ---- Phase: Language Selection ----
  if (effectivePhase === 'language') {
    return <LanguageSelection onSelect={handleLanguageSelect} />;
  }

  // ---- Phase: Landing Page ----
  if (effectivePhase === 'landing') {
    return (
      <LandingPage
        lang={lang}
        onLogin={() => setPhase('auth')}
        onTrial={() => setPhase('auth')}
      />
    );
  }

  // ---- Phase: Auth ----
  if (effectivePhase === 'auth') {
    return (
      <AuthScreen
        lang={lang}
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setPhase('landing')}
      />
    );
  }

  // ---- Phase: Role Selection ----
  if (effectivePhase === 'role') {
    return (
      <RoleSelection
        lang={lang}
        onSelect={handleRoleSelect}
        onSkip={() => { setPhase('app'); setView('home'); }}
      />
    );
  }

  // ---- Phase: App (Dashboard + Clinical Views) ----
  return (
    <div dir={dir} className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} z-50 w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
          <div className="w-11 h-11 bg-teal-500/20 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-teal-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold leading-tight">VetRay</h1>
            <p className="text-xs text-slate-400">{tr('tagline', lang)}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {navItems(lang).map(item => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-teal-500/20 text-teal-300 shadow-lg' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 text-center mb-2">{user?.email}</p>
          <p className="text-xs text-slate-500 text-center">{tr('poweredBy', lang)}</p>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-800">
              {navItems(lang).find(n => n.id === view)?.label}
            </h2>
          </div>
          {output && view !== 'home' && view !== 'caseInput' && view !== 'tests' && view !== 'vaccination' && view !== 'pharmacology' && view !== 'diagnostics' && view !== 'settings' && (
            <div className="hidden sm:flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-lg">
              <PawPrint className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">
                {input?.species} • {output.hypotheses.length} {tr('hypotheses', lang)}
              </span>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {view === 'home' && <Dashboard lang={lang} onNavigate={setView} onSignOut={handleSignOut} />}
          {view === 'caseInput' && <CaseInputView lang={lang} onRun={handleRun} onLoadSample={(c) => { setInput(c); setView('caseInput'); }} initialInput={input} />}
          {view === 'reasoning' && (output ? <ReasoningView output={output} lang={lang} onBack={() => setView('caseInput')} onNavigate={setView} /> : <NoOutputView lang={lang} onStart={() => setView('caseInput')} />)}
          {view === 'hypotheses' && (output ? <HypothesesView output={output} lang={lang} /> : <NoOutputView lang={lang} onStart={() => setView('caseInput')} />)}
          {view === 'evidence' && (output ? <EvidenceView output={output} lang={lang} /> : <NoOutputView lang={lang} onStart={() => setView('caseInput')} />)}
          {view === 'tree' && (output ? <TreeView tree={output.reasoningTree} lang={lang} /> : <NoOutputView lang={lang} onStart={() => setView('caseInput')} />)}
          {view === 'decision' && (output ? <DecisionView output={output} lang={lang} /> : <NoOutputView lang={lang} onStart={() => setView('caseInput')} />)}
          {view === 'summary' && (output && input ? <SummaryView output={output} input={input} lang={lang} /> : <NoOutputView lang={lang} onStart={() => setView('caseInput')} />)}
          {view === 'tests' && <TestsView lang={lang} />}
          {view === 'vaccination' && <VaccinationView lang={lang} />}
          {view === 'pharmacology' && <PharmacologyView lang={lang} />}
          {view === 'diagnostics' && <DiagnosticsView lang={lang} />}
          {view === 'settings' && <SettingsView lang={lang} onSignOut={handleSignOut} />}
        </main>
      </div>
    </div>
  );
}

// ============================================================
// Navigation items
// ============================================================
function navItems(lang: Lang): { id: View; label: string; icon: typeof Home }[] {
  return [
    { id: 'home', label: tr('home', lang), icon: Home },
    { id: 'caseInput', label: tr('newCase', lang), icon: Plus },
    { id: 'reasoning', label: tr('reasoning', lang), icon: Brain },
    { id: 'hypotheses', label: tr('hypotheses', lang), icon: Stethoscope },
    { id: 'evidence', label: tr('evidence', lang), icon: ClipboardList },
    { id: 'tree', label: tr('reasoningTree', lang), icon: TreePine },
    { id: 'decision', label: tr('decisionSupport', lang), icon: Lightbulb },
    { id: 'vaccination', label: tr('vaccination', lang), icon: Syringe },
    { id: 'pharmacology', label: tr('pharmacology', lang), icon: FlaskConical },
    { id: 'diagnostics', label: tr('diagnostics', lang), icon: Microscope },
    { id: 'summary', label: tr('caseSummary', lang), icon: FileText },
    { id: 'tests', label: tr('tests', lang), icon: Play },
    { id: 'settings', label: tr('settings', lang), icon: Settings },
  ];
}

// ============================================================
// Case Input View
// ============================================================
function CaseInputView({ lang, onRun, onLoadSample, initialInput }: {
  lang: Lang;
  onRun: (input: ClinicalInput) => void;
  onLoadSample: (c: ClinicalInput) => void;
  initialInput: ClinicalInput | null;
}) {
  const [species, setSpecies] = useState<Species>(initialInput?.species || 'dog');
  const [ageYears, setAgeYears] = useState<string>(initialInput?.ageYears?.toString() || '');
  const [sex, setSex] = useState<'male' | 'female' | 'unknown'>(initialInput?.sex || 'unknown');
  const [signs, setSigns] = useState<Record<string, boolean>>(initialInput?.signs as Record<string, boolean> || {});
  const [vaccinationStatus, setVaccinationStatus] = useState<'complete' | 'incomplete' | 'unknown'>(initialInput?.vaccinationStatus || 'unknown');
  const [durationDays, setDurationDays] = useState<string>(initialInput?.durationDays?.toString() || '');
  const [environmentalFactors, setEnvironmentalFactors] = useState<string[]>(initialInput?.environmentalFactors || []);
  const [labFindings, setLabFindings] = useState<Record<string, boolean>>(initialInput?.labFindings as Record<string, boolean> || {});
  const [showSamples, setShowSamples] = useState(false);

  const speciesOptions: { value: Species; label: string }[] = [
    { value: 'dog', label: tr('dog', lang) },
    { value: 'cat', label: tr('cat', lang) },
    { value: 'bird', label: tr('bird', lang) },
    { value: 'rabbit', label: tr('rabbit', lang) },
    { value: 'horse', label: tr('horse', lang) },
    { value: 'other', label: tr('other', lang) },
  ];

  const availableSigns = useMemo(() => {
    return clinicalSigns.filter(s => !s.species || s.species.includes(species) || s.species.length === 0);
  }, [species]);

  const signsByCategory = useMemo(() => {
    const map = new Map<string, typeof clinicalSigns>();
    for (const sign of availableSigns) {
      if (sign.type !== 'boolean') continue;
      const cat = lang === 'fa' ? sign.categoryFa : sign.category;
      const existing = map.get(cat) || [];
      existing.push(sign);
      map.set(cat, existing);
    }
    return Array.from(map.entries());
  }, [availableSigns, lang]);

  const toggleSign = (name: string) => setSigns(prev => ({ ...prev, [name]: !prev[name] }));
  const toggleEnvFactor = (factor: string) => setEnvironmentalFactors(prev => prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]);
  const toggleLabFinding = (name: string) => setLabFindings(prev => ({ ...prev, [name]: !prev[name] }));

  const handleRun = () => {
    onRun({
      species,
      ageYears: ageYears ? parseFloat(ageYears) : undefined,
      sex,
      signs: Object.fromEntries(Object.entries(signs).filter(([, v]) => v)),
      vaccinationStatus,
      durationDays: durationDays ? parseInt(durationDays) : undefined,
      environmentalFactors: environmentalFactors.length > 0 ? environmentalFactors : undefined,
      labFindings: Object.keys(labFindings).length > 0 ? Object.fromEntries(Object.entries(labFindings).filter(([, v]) => v)) : undefined,
    });
  };

  const handleClear = () => {
    setSigns({}); setLabFindings({}); setEnvironmentalFactors([]); setAgeYears(''); setDurationDays('');
  };

  const handleLoadSample = (sample: SampleCase) => {
    const c = sample.input;
    setSpecies(c.species);
    setAgeYears(c.ageYears?.toString() || '');
    setSex(c.sex || 'unknown');
    setSigns(c.signs as Record<string, boolean> || {});
    setVaccinationStatus(c.vaccinationStatus || 'unknown');
    setDurationDays(c.durationDays?.toString() || '');
    setEnvironmentalFactors(c.environmentalFactors || []);
    setLabFindings(c.labFindings as Record<string, boolean> || {});
    setShowSamples(false);
  };

  const envOptions = ['recent_boarding', 'multi_pet_household', 'outdoor_access', 'tick_exposure', 'toxin_exposure'];
  const labOptions = clinicalSigns.filter(s => s.category === 'lab' && s.type === 'boolean');
  const selectedSignCount = Object.values(signs).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {showSamples && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">{tr('loadSample', lang)}</h3>
            <button onClick={() => setShowSamples(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleCases.map(c => (
              <button key={c.id} onClick={() => handleLoadSample(c)} className="text-right p-4 bg-slate-50 hover:bg-teal-50 hover:border-teal-200 border border-slate-200 rounded-xl transition">
                <p className="font-medium text-slate-800 text-sm">{lang === 'fa' ? c.titleFa : c.title}</p>
                <p className="text-xs text-slate-500 mt-1">{lang === 'fa' ? c.descriptionFa : c.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <SectionCard icon={PawPrint} title={lang === 'fa' ? 'اطلاعات بیمار' : 'Patient Information'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>{tr('species', lang)}</Label>
            <div className="grid grid-cols-3 gap-2">
              {speciesOptions.map(s => (
                <button key={s.value} onClick={() => setSpecies(s.value)} className={`px-2 py-2.5 rounded-xl text-sm font-medium transition ${species === s.value ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>{tr('age', lang)}</Label>
            <input type="number" step="0.1" min="0" value={ageYears} onChange={e => setAgeYears(e.target.value)} placeholder="0.5" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 focus:bg-white transition" />
          </div>
          <div>
            <Label>{tr('sex', lang)}</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'unknown'] as const).map(s => (
                <button key={s} onClick={() => setSex(s)} className={`px-2 py-2.5 rounded-xl text-sm font-medium transition ${sex === s ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {tr(s, lang)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>{tr('duration', lang)}</Label>
            <input type="number" min="0" value={durationDays} onChange={e => setDurationDays(e.target.value)} placeholder="3" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 focus:bg-white transition" />
          </div>
        </div>
        <div className="mt-4">
          <Label>{tr('vaccination', lang)}</Label>
          <div className="grid grid-cols-3 gap-2">
            {(['complete', 'incomplete', 'unknown'] as const).map(v => (
              <button key={v} onClick={() => setVaccinationStatus(v)} className={`px-3 py-2.5 rounded-xl text-sm font-medium transition ${vaccinationStatus === v ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {tr(v, lang)}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Stethoscope} title={tr('clinicalSigns', lang)} badge={`${selectedSignCount}`}>
        <div className="space-y-5">
          {signsByCategory.map(([category, catSigns]) => (
            <div key={category}>
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {catSigns.map(sign => {
                  const selected = signs[sign.name] === true;
                  const isRedFlag = sign.redFlag;
                  return (
                    <button
                      key={sign.id}
                      onClick={() => toggleSign(sign.name)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                        selected
                          ? isRedFlag ? 'bg-red-500 text-white' : 'bg-teal-600 text-white'
                          : isRedFlag
                            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      {isRedFlag && !selected && <AlertTriangle className="w-3.5 h-3.5" />}
                      {lang === 'fa' ? sign.labelFa : sign.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Activity} title={tr('environmental', lang)}>
        <div className="flex flex-wrap gap-2">
          {envOptions.map(factor => (
            <button key={factor} onClick={() => toggleEnvFactor(factor)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${environmentalFactors.includes(factor) ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {factor.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={FlaskConical} title={tr('labFindings', lang)}>
        <div className="flex flex-wrap gap-2">
          {labOptions.map(lab => {
            const selected = labFindings[lab.name] === true;
            return (
              <button key={lab.id} onClick={() => toggleLabFinding(lab.name)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${selected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {selected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                {lang === 'fa' ? lab.labelFa : lab.label}
              </button>
            );
          })}
        </div>
      </SectionCard>

      <div className="flex flex-wrap gap-3 sticky bottom-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-lg">
        <button onClick={handleRun} disabled={selectedSignCount === 0} className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-medium hover:bg-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
          <Play className="w-5 h-5" />
          {tr('runReasoning', lang)}
        </button>
        <button onClick={() => setShowSamples(!showSamples)} className="px-5 bg-slate-100 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-200 transition flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {tr('loadSample', lang)}
        </button>
        <button onClick={handleClear} className="px-5 bg-slate-100 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-200 transition flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          {tr('clear', lang)}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Reasoning View
// ============================================================
function ReasoningView({ output, lang, onBack, onNavigate }: {
  output: ReasoningOutput;
  lang: Lang;
  onBack: () => void;
  onNavigate: (v: View) => void;
}) {
  const confidenceColors = {
    high: 'bg-green-50 text-green-700 border-green-200',
    moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-orange-50 text-orange-700 border-orange-200',
    insufficient: 'bg-slate-50 text-slate-500 border-slate-200',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{lang === 'fa' ? 'خلاصه استدلال' : 'Reasoning Summary'}</h3>
            <p className="text-sm text-slate-500 mt-1">{lang === 'fa' ? output.summaryFa : output.summary}</p>
          </div>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${confidenceColors[output.confidence]}`}>
            {tr('confidence', lang)}: {tr(output.confidence, lang)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={FileText} label={tr('facts', lang)} value={output.facts.filter(f => f.category === 'clinical_sign' || f.category === 'lab').length} />
          <Stat icon={Zap} label={tr('rules', lang)} value={output.firedRules.length} />
          <Stat icon={Stethoscope} label={tr('hypotheses', lang)} value={output.hypotheses.length} />
        </div>
      </div>

      {output.redFlags.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-800">{tr('redFlags', lang)} ({output.redFlags.length})</h3>
          </div>
          <div className="space-y-3">
            {output.redFlags.map((rf, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-red-200">
                <p className="font-bold text-red-700">{lang === 'fa' ? rf.flag.labelFa : rf.flag.label}</p>
                <p className="text-sm text-red-600 mt-1">{lang === 'fa' ? rf.flag.messageFa : rf.flag.message}</p>
                <p className="text-sm text-red-500 mt-2 font-medium">{lang === 'fa' ? rf.flag.actionFa : rf.flag.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {output.contradictions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-800">{tr('contradictions', lang)}</h3>
          </div>
          <div className="space-y-2">
            {output.contradictions.map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-amber-200">
                <p className="text-sm text-amber-700">{lang === 'fa' ? c.messageFa : c.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ListTree className="w-5 h-5 text-teal-600" />
          {tr('reasoningPath', lang)}
        </h3>
        <div className="space-y-2">
          {output.reasoningPath.map((step, i) => (
            <ReasoningStepCard key={i} step={step} lang={lang} isLast={i === output.reasoningPath.length - 1} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition">
          {lang === 'fa' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {tr('backToInput', lang)}
        </button>
        <button onClick={() => onNavigate('hypotheses')} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition">
          {tr('hypotheses', lang)}
          {lang === 'fa' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function ReasoningStepCard({ step, lang, isLast }: { step: ReasoningOutput['reasoningPath'][0]; lang: Lang; isLast: boolean }) {
  const typeConfig = {
    fact: { icon: FileText, color: 'bg-blue-50 text-blue-600 border-blue-200', label: tr('facts', lang) },
    rule: { icon: Zap, color: 'bg-amber-50 text-amber-600 border-amber-200', label: tr('rules', lang) },
    inference: { icon: Brain, color: 'bg-purple-50 text-purple-600 border-purple-200', label: tr('inference', lang) },
    hypothesis: { icon: Stethoscope, color: 'bg-teal-50 text-teal-600 border-teal-200', label: tr('hypotheses', lang) },
  };
  const cfg = typeConfig[step.type];
  const Icon = cfg.icon;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 ${cfg.color} border rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
      </div>
      <div className="flex-1 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-slate-400">{cfg.label}</span>
          <span className="text-xs text-slate-300">#{step.step}</span>
        </div>
        <p className="font-medium text-slate-800 text-sm">{step.title}</p>
        <p className="text-sm text-slate-500 mt-1">{step.detail}</p>
      </div>
    </div>
  );
}

// ============================================================
// Hypotheses View
// ============================================================
function HypothesesView({ output, lang }: { output: ReasoningOutput; lang: Lang }) {
  if (output.hypotheses.length === 0) {
    return <div className="max-w-3xl mx-auto"><EmptyState icon={Stethoscope} title={tr('noHypotheses', lang)} lang={lang} /></div>;
  }
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {output.hypotheses.map(h => <HypothesisCard key={h.disease.id} hypothesis={h} lang={lang} />)}
    </div>
  );
}

function HypothesisCard({ hypothesis: h, lang }: { hypothesis: HypothesisResult; lang: Lang }) {
  const [expanded, setExpanded] = useState(h.rank === 1);
  const confidenceColors = {
    high: 'bg-green-100 text-green-700', moderate: 'bg-amber-100 text-amber-700',
    low: 'bg-orange-100 text-orange-700', insufficient: 'bg-slate-100 text-slate-500',
  };
  const riskColors = {
    low: 'bg-green-50 text-green-600', medium: 'bg-amber-50 text-amber-600',
    high: 'bg-orange-50 text-orange-600', critical: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`bg-white rounded-2xl border transition ${h.disease.redFlag ? 'border-red-200' : 'border-slate-200'}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-5 flex items-start gap-4 text-right">
        <div className={`w-10 h-10 ${h.rank === 1 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'} rounded-xl flex items-center justify-center font-bold flex-shrink-0`}>
          {h.rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-slate-800">{lang === 'fa' ? h.disease.nameFa : h.disease.name}</h4>
            {h.disease.redFlag && <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {tr('critical', lang)}</span>}
          </div>
          <p className="text-sm text-slate-500 mt-1">{lang === 'fa' ? h.disease.categoryFa : h.disease.category}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${confidenceColors[h.confidence]}`}>{tr('confidence', lang)}: {tr(h.confidence, lang)} ({h.confidenceScore})</span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${riskColors[h.riskLevel]}`}>{tr('riskLevel', lang)}: {tr(h.riskLevel, lang)}</span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">{h.firedRules.length} {lang === 'fa' ? 'قاعده' : 'rules'}</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">{lang === 'fa' ? h.disease.descriptionFa : h.disease.description}</p>
          <div>
            <p className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1"><Check className="w-4 h-4" /> {tr('supportingEvidence', lang)} ({h.supportingFacts.length})</p>
            <div className="flex flex-wrap gap-2">
              {h.supportingFacts.map(f => <span key={f.id} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">{f.label}</span>)}
              {h.supportingFacts.length === 0 && <span className="text-sm text-slate-400">—</span>}
            </div>
          </div>
          {h.missingEvidence.length > 0 && (
            <div>
              <p className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-1"><Info className="w-4 h-4" /> {tr('missingEvidence', lang)} ({h.missingEvidence.length})</p>
              <div className="flex flex-wrap gap-2">
                {h.missingEvidence.map(m => <span key={m} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm">{m.replace(/_/g, ' ')}</span>)}
              </div>
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><Zap className="w-4 h-4" /> {lang === 'fa' ? 'قواعد فعال‌شده' : 'Rules Activated'}</p>
            <div className="space-y-2">
              {h.firedRules.map(fr => (
                <div key={fr.rule.id} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-sm font-medium text-slate-700">{fr.rule.id}: {fr.rule.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{fr.rule.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Evidence View
// ============================================================
function EvidenceView({ output, lang }: { output: ReasoningOutput; lang: Lang }) {
  if (output.hypotheses.length === 0) return <div className="max-w-3xl mx-auto"><EmptyState icon={ClipboardList} title={tr('noHypotheses', lang)} lang={lang} /></div>;
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {output.hypotheses.map(h => (
        <div key={h.disease.id} className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 ${h.rank === 1 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'} rounded-lg flex items-center justify-center text-sm font-bold`}>{h.rank}</div>
            <h4 className="font-bold text-slate-800">{lang === 'fa' ? h.disease.nameFa : h.disease.name}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1"><Check className="w-4 h-4" /> {tr('supportingEvidence', lang)}</p>
              <ul className="space-y-1">
                {h.supportingFacts.map(f => <li key={f.id} className="text-sm text-green-700">+ {f.label}</li>)}
                {h.supportingFacts.length === 0 && <li className="text-sm text-slate-400">—</li>}
              </ul>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-1"><Info className="w-4 h-4" /> {tr('missingEvidence', lang)}</p>
              <ul className="space-y-1">
                {h.missingEvidence.map(m => <li key={m} className="text-sm text-amber-700">? {m.replace(/_/g, ' ')}</li>)}
                {h.missingEvidence.length === 0 && <li className="text-sm text-slate-400">—</li>}
              </ul>
            </div>
          </div>
          {h.requiredTests.length > 0 && (
            <div className="mt-4 bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-1"><FlaskConical className="w-4 h-4" /> {tr('requiredTests', lang)}</p>
              <ul className="space-y-1">
                {h.requiredTests.map((test, i) => <li key={i} className="text-sm text-blue-700">• {lang === 'fa' ? test.labelFa : test.label}</li>)}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Tree View
// ============================================================
function TreeView({ tree, lang }: { tree: ReasoningTreeNode; lang: Lang }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TreePine className="w-5 h-5 text-teal-600" />{tr('reasoningTree', lang)}</h3>
        <TreeNode node={tree} lang={lang} depth={0} />
      </div>
    </div>
  );
}

function TreeNode({ node, lang, depth }: { node: ReasoningTreeNode; lang: Lang; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const typeColors = {
    input: 'bg-slate-100 text-slate-700', fact: 'bg-blue-50 text-blue-700',
    rule: 'bg-amber-50 text-amber-700', syndrome: 'bg-purple-50 text-purple-700', hypothesis: 'bg-teal-50 text-teal-700',
  };
  return (
    <div className={depth > 0 ? (lang === 'fa' ? 'mr-4 border-r-2 border-slate-100 pr-3' : 'ml-4 border-l-2 border-slate-100 pl-3') : ''}>
      <div onClick={() => hasChildren && setExpanded(!expanded)} className={`flex items-center gap-2 py-2 ${hasChildren ? 'cursor-pointer hover:bg-slate-50 rounded-lg px-2' : 'px-2'}`}>
        {hasChildren && <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-0' : '-rotate-90'}`} />}
        {!hasChildren && <div className="w-4 flex-shrink-0" />}
        <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${typeColors[node.type]}`}>{lang === 'fa' ? node.labelFa : node.label}</span>
        {node.confidence && <span className="text-xs text-slate-400">({tr(node.confidence, lang)}: {node.score})</span>}
      </div>
      {node.detail && expanded && <p className="text-xs text-slate-500 px-2 pb-2">{node.detail}</p>}
      {expanded && hasChildren && (
        <div className="space-y-0.5">
          {node.children.map(child => <TreeNode key={child.id} node={child} lang={lang} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Decision View
// ============================================================
function DecisionView({ output, lang }: { output: ReasoningOutput; lang: Lang }) {
  const priorityColors = { high: 'border-red-200 bg-red-50', medium: 'border-amber-200 bg-amber-50', low: 'border-slate-200 bg-slate-50' };
  const priorityText = { high: 'text-red-600', medium: 'text-amber-600', low: 'text-slate-500' };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {output.nextBestQuestions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" />{tr('nextBestQuestion', lang)}</h3>
          <p className="text-sm text-slate-500 mb-4">{lang === 'fa' ? 'پاسخ به این سوالات بیشترین کاهش عدم‌قطعیت را ایجاد می‌کند:' : 'Answering these would most reduce uncertainty:'}</p>
          <div className="space-y-3">
            {output.nextBestQuestions.map((q, i) => (
              <div key={i} className={`p-4 rounded-xl border ${q.clinicalValue === 'high' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
                <p className="font-medium text-slate-800 text-sm">{lang === 'fa' ? q.questionFa : q.question}</p>
                <p className="text-xs text-slate-500 mt-1">{lang === 'fa' ? q.rationaleFa : q.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" />{tr('nextSteps', lang)}</h3>
        {output.decisionSupport.length > 0 ? (
          <div className="space-y-3">
            {output.decisionSupport.map((item, i) => (
              <div key={i} className={`p-4 rounded-xl border ${priorityColors[item.priority]}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{lang === 'fa' ? item.labelFa : item.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{lang === 'fa' ? item.reasonFa : item.reason}</p>
                  </div>
                  <span className={`text-xs font-medium ${priorityText[item.priority]} flex-shrink-0`}>{tr(item.priority, lang)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-slate-400">{lang === 'fa' ? 'اقدام پیشنهادی خاصی وجود ندارد.' : 'No specific recommendations.'}</p>}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">{tr('disclaimer', lang)}</p>
      </div>
    </div>
  );
}

// ============================================================
// Summary View
// ============================================================
function SummaryView({ output, input, lang }: { output: ReasoningOutput; input: ClinicalInput; lang: Lang }) {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-teal-600" />{tr('caseSummary', lang)}</h3>
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">{lang === 'fa' ? 'بیمار' : 'Patient'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div><span className="text-slate-400">{tr('species', lang)}: </span><span className="font-medium text-slate-700">{tr(input.species, lang)}</span></div>
            {input.ageYears !== undefined && <div><span className="text-slate-400">{tr('age', lang)}: </span><span className="font-medium text-slate-700">{input.ageYears}</span></div>}
            {input.sex && input.sex !== 'unknown' && <div><span className="text-slate-400">{tr('sex', lang)}: </span><span className="font-medium text-slate-700">{tr(input.sex, lang)}</span></div>}
            {input.durationDays !== undefined && <div><span className="text-slate-400">{tr('duration', lang)}: </span><span className="font-medium text-slate-700">{input.durationDays}</span></div>}
          </div>
        </div>
        <div className="bg-teal-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-slate-700">{lang === 'fa' ? output.summaryFa : output.summary}</p>
        </div>
        {output.redFlags.length > 0 && (
          <div className="bg-red-50 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-red-700 mb-2">{tr('redFlags', lang)}: {output.redFlags.length}</p>
            {output.redFlags.map((rf, i) => <p key={i} className="text-sm text-red-600">• {lang === 'fa' ? rf.flag.labelFa : rf.flag.label}</p>)}
          </div>
        )}
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">{tr('hypotheses', lang)}</p>
          <div className="space-y-2">
            {output.hypotheses.slice(0, 5).map(h => (
              <div key={h.disease.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <span className={`w-7 h-7 ${h.rank === 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'} rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0`}>{h.rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{lang === 'fa' ? h.disease.nameFa : h.disease.name}</p>
                  <p className="text-xs text-slate-400">{tr('confidence', lang)}: {tr(h.confidence, lang)} ({h.confidenceScore})</p>
                </div>
                {h.disease.redFlag && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{tr('disclaimer', lang)}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Tests View
// ============================================================
function TestsView({ lang }: { lang: Lang }) {
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const handleRun = () => {
    setRunning(true);
    setTimeout(() => { setResults(runAllTests()); setRunning(false); }, 300);
  };
  const passed = results?.filter(r => r.pass).length || 0;
  const failed = results?.filter(r => !r.pass).length || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><FlaskConical className="w-5 h-5 text-teal-600" />{tr('runTests', lang)}</h3>
            <p className="text-sm text-slate-500 mt-1">{lang === 'fa' ? 'آزمون موتور استدلال' : 'Reasoning engine tests'}</p>
          </div>
          <button onClick={handleRun} disabled={running} className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition disabled:opacity-50 flex items-center gap-2">
            <Play className="w-4 h-4" />{tr('runTests', lang)}
          </button>
        </div>
        {results && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className={`p-4 rounded-xl ${failed === 0 ? 'bg-green-50' : 'bg-slate-50'}`}><p className="text-2xl font-bold text-slate-800">{passed}</p><p className="text-sm text-slate-500">{lang === 'fa' ? 'موفق' : 'Passed'}</p></div>
              <div className={`p-4 rounded-xl ${failed > 0 ? 'bg-red-50' : 'bg-slate-50'}`}><p className="text-2xl font-bold text-slate-800">{failed}</p><p className="text-sm text-slate-500">{lang === 'fa' ? 'ناموفق' : 'Failed'}</p></div>
            </div>
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${r.pass ? 'bg-green-50' : 'bg-red-50'}`}>
                  {r.pass ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                  <div><p className="text-sm font-medium text-slate-800">{r.name}</p><p className="text-xs text-slate-500 mt-0.5">{r.message}</p></div>
                </div>
              ))}
            </div>
          </>
        )}
        {!results && !running && (
          <div className="text-center py-12 text-slate-400">
            <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{lang === 'fa' ? 'برای اجرای آزمون‌ها روی دکمه کلیک کنید' : 'Click the button to run tests'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Diagnostics View (placeholder)
// ============================================================
function DiagnosticsView({ lang }: { lang: Lang }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Microscope className="w-8 h-8 text-orange-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{tr('diagnostics', lang)}</h3>
        <p className="text-slate-500 text-sm">{lang === 'fa' ? 'پنل‌های آزمایشگاهی و تفسیر نتایج به‌زودی در دسترس خواهد بود.' : 'Laboratory panels and interpretation coming soon.'}</p>
      </div>
    </div>
  );
}

// ============================================================
// Settings View
// ============================================================
function SettingsView({ lang, onSignOut }: { lang: Lang; onSignOut: () => void }) {
  const { user, trialState, daysRemaining } = useAuth();
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-teal-600" />{tr('settings', lang)}</h3>
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl"><span className="text-sm text-slate-500">{tr('email', lang)}</span><span className="text-sm font-medium text-slate-800">{user?.email}</span></div>
          <div className="flex justify-between p-3 bg-slate-50 rounded-xl"><span className="text-sm text-slate-500">{tr('trialStatus', lang)}</span><span className="text-sm font-medium text-slate-800">{tr(trialState, lang)}</span></div>
          {trialState !== 'subscribed' && trialState !== 'trial_expired' && (
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl"><span className="text-sm text-slate-500">{tr('daysRemaining', lang)}</span><span className="text-sm font-medium text-slate-800">{daysRemaining}</span></div>
          )}
        </div>
      </div>
      <button onClick={onSignOut} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition flex items-center justify-center gap-2">
        {tr('logout', lang)}
      </button>
    </div>
  );
}

// ============================================================
// Shared Components
// ============================================================
function SectionCard({ icon: Icon, title, badge, children }: { icon: typeof Home; title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-teal-600" />
        <h3 className="font-bold text-slate-800">{title}</h3>
        {badge && <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-2">{children}</label>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: number }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-center">
      <Icon className="w-5 h-5 text-slate-400 mx-auto mb-1" />
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, lang }: { icon: typeof Home; title: string; lang: Lang }) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-300" />
      </div>
      <p className="text-slate-600">{title}</p>
      <p className="text-xs text-slate-400 mt-2">{tr('disclaimer', lang)}</p>
    </div>
  );
}

function NoOutputView({ lang, onStart }: { lang: Lang; onStart: () => void }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-teal-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{lang === 'fa' ? 'هنوز کیسی اجرا نشده' : 'No case has been run yet'}</h3>
        <p className="text-slate-500 mb-6 max-w-sm mx-auto">{lang === 'fa' ? 'برای مشاهده نتایج، ابتدا یک کیس جدید ایجاد کنید.' : 'Create a new case to see reasoning results.'}</p>
        <button onClick={onStart} className="bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700 transition inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />{tr('startCase', lang)}
        </button>
      </div>
    </div>
  );
}
