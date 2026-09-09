import { useState, useEffect, useCallback } from 'react';
import type { Lang, UserRole, SavedCase, Species } from '@/types';
import { isRTL, USER_ROLES } from '@/types';
import { tr, trRole, trFn } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  Plus, Stethoscope, FlaskConical, Syringe, AlertTriangle, FileText,
  Brain, Clock, Calendar, PawPrint, ChevronLeft, ChevronRight,
  Activity, Lightbulb, ClipboardList, ListTree, Play, Microscope,
  Settings, LogOut, User, Zap, CheckCircle2, Sparkles,
} from 'lucide-react';

export type View = 'home' | 'caseInput' | 'reasoning' | 'hypotheses' | 'evidence' | 'tree' | 'decision' | 'summary' | 'tests'
  | 'vaccination' | 'pharmacology' | 'diagnostics' | 'settings' | 'savedCases';

export function Dashboard({ lang, onNavigate, onSignOut }: { lang: Lang; onNavigate: (v: View) => void; onSignOut: () => void }) {
  const { user, trialState, daysRemaining } = useAuth();
  const [cases, setCases] = useState<SavedCase[]>([]);
  const dir = isRTL(lang) ? 'rtl' : 'ltr';
  const ForwardIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const loadCases = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('veterinary_cases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setCases(data as unknown as SavedCase[]);
  }, [user]);

  useEffect(() => { loadCases(); }, [loadCases]);

  const trialBadge = () => {
    if (trialState === 'subscribed') return { text: tr('subscribeNow', lang), color: 'bg-green-500/20 text-green-400' };
    if (trialState === 'trial_expired') return { text: tr('trialExpired', lang), color: 'bg-red-500/20 text-red-400' };
    if (trialState === 'trial_expiring') return { text: trFn('daysRemaining', lang, daysRemaining), color: 'bg-amber-500/20 text-amber-400' };
    return { text: trFn('daysRemaining', lang, daysRemaining), color: 'bg-teal-500/20 text-teal-400' };
  };

  const badge = trialBadge();

  const tools: { id: View; icon: typeof Brain; label: string; color: string }[] = [
    { id: 'caseInput', icon: Plus, label: tr('newCase', lang), color: 'bg-teal-500/20 text-teal-400' },
    { id: 'reasoning', icon: Brain, label: tr('reasoning', lang), color: 'bg-blue-500/20 text-blue-400' },
    { id: 'hypotheses', icon: Stethoscope, label: tr('hypotheses', lang), color: 'bg-purple-500/20 text-purple-400' },
    { id: 'evidence', icon: ClipboardList, label: tr('evidence', lang), color: 'bg-indigo-500/20 text-indigo-400' },
    { id: 'tree', icon: ListTree, label: tr('reasoningTree', lang), color: 'bg-cyan-500/20 text-cyan-400' },
    { id: 'decision', icon: Lightbulb, label: tr('decisionSupport', lang), color: 'bg-amber-500/20 text-amber-400' },
    { id: 'vaccination', icon: Syringe, label: tr('vaccination', lang), color: 'bg-green-500/20 text-green-400' },
    { id: 'pharmacology', icon: FlaskConical, label: tr('pharmacology', lang), color: 'bg-pink-500/20 text-pink-400' },
    { id: 'diagnostics', icon: Microscope, label: tr('diagnostics', lang), color: 'bg-orange-500/20 text-orange-400' },
    { id: 'summary', icon: FileText, label: tr('caseSummary', lang), color: 'bg-slate-500/20 text-slate-300' },
    { id: 'tests', icon: Play, label: tr('tests', lang), color: 'bg-rose-500/20 text-rose-400' },
    { id: 'settings', icon: Settings, label: tr('settings', lang), color: 'bg-slate-500/20 text-slate-400' },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <span className="text-slate-800 font-bold text-sm">VetRay</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${badge.color}`}>
              {badge.text}
            </span>
            <button onClick={onSignOut} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-teal-600 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24" />
          <div className="relative">
            <h1 className="text-xl lg:text-2xl font-bold mb-1">
              {tr('welcome', lang)}{user?.email ? `, ${user.email.split('@')[0]}` : ''}
            </h1>
            <p className="text-slate-300 text-sm mb-3">
              {user?.role ? trRole(user.role as UserRole, lang) : tr('selectRole', lang)}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-sm">
              <Sparkles className="w-4 h-4 text-teal-300" />
              {badge.text}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 mb-3">{tr('quickActions', lang)}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => onNavigate(tool.id)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-center group"
                >
                  <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-slate-700 text-sm font-medium">{tool.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent cases */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 mb-3">{tr('recentCases', lang)}</h2>
          {cases.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
              <PawPrint className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">{tr('noCasesYet', lang)}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cases.map(c => (
                <button
                  key={c.id}
                  onClick={() => onNavigate('caseInput')}
                  className="w-full bg-white rounded-xl p-4 border border-slate-200 hover:border-teal-300 transition flex items-center gap-3 text-right"
                >
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <PawPrint className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {c.patient_name || tr(c.species as Species, lang)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(c.created_at).toLocaleDateString()} • {c.status}
                    </p>
                  </div>
                  <ForwardIcon className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{tr('disclaimer', lang)}</p>
        </div>
      </main>
    </div>
  );
}
