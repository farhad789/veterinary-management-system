import type { Lang, UserRole } from '@/types';
import { isRTL } from '@/types';
import { tr } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import {
  Brain, Sparkles, Shield, Activity, Stethoscope, ClipboardList,
  Lightbulb, Zap, PawPrint, FileText, Syringe, FlaskConical,
  AlertTriangle, ChevronLeft, ChevronRight, Microscope, BookOpen,
} from 'lucide-react';

export function LandingPage({ lang, onLogin, onTrial }: { lang: Lang; onLogin: () => void; onTrial: () => void }) {
  const dir = isRTL(lang) ? 'rtl' : 'ltr';
  const ForwardIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Nav bar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-white font-bold">VetRay</span>
          </div>
          <button onClick={onLogin} className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition">
            {tr('login', lang)}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 rounded-full text-sm text-teal-300 mb-6">
            <Sparkles className="w-4 h-4" />
            {tr('poweredBy', lang)}
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {tr('heroTitle', lang)}
          </h1>
          <p className="text-slate-400 text-base lg:text-lg mb-8 max-w-2xl mx-auto">
            {tr('heroSubtitle', lang)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onTrial}
              className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-xl font-medium transition inline-flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30"
            >
              {tr('startFreeTrial', lang)}
              <ForwardIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onLogin}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-medium transition border border-white/10"
            >
              {tr('login', lang)}
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-4">{tr('noPaymentRequired', lang)}</p>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">{tr('theProblem', lang)}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{tr('problemDesc', lang)}</p>
          </div>
          <div className="bg-teal-500/10 rounded-2xl p-6 border border-teal-500/20">
            <h3 className="text-lg font-bold text-teal-300 mb-3">{tr('theSolution', lang)}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{tr('solutionDesc', lang)}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h3 className="text-xl font-bold text-white text-center mb-8">{tr('clinicalTools', lang)}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Stethoscope, label: tr('reasoning', lang), color: 'bg-teal-500/20 text-teal-400' },
            { icon: ClipboardList, label: tr('hypotheses', lang), color: 'bg-blue-500/20 text-blue-400' },
            { icon: Lightbulb, label: tr('decisionSupport', lang), color: 'bg-amber-500/20 text-amber-400' },
            { icon: Syringe, label: tr('vaccination', lang), color: 'bg-green-500/20 text-green-400' },
            { icon: FlaskConical, label: tr('pharmacology', lang), color: 'bg-purple-500/20 text-purple-400' },
            { icon: Microscope, label: tr('diagnostics', lang), color: 'bg-cyan-500/20 text-cyan-400' },
            { icon: AlertTriangle, label: tr('emergency', lang), color: 'bg-red-500/20 text-red-400' },
            { icon: FileText, label: tr('caseSummary', lang), color: 'bg-indigo-500/20 text-indigo-400' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-slate-300 text-sm font-medium">{f.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Who we serve */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h3 className="text-xl font-bold text-white text-center mb-8">{tr('whoWeServe', lang)}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {['small_animal_vet', 'large_animal_vet', 'equine_vet', 'poultry_vet', 'vet_student', 'vet_technician', 'vaccinator', 'farmer', 'pet_owner', 'horse_owner', 'breeder'].map(role => (
            <span key={role} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm">
              {tr(`role_${role}`, lang)}
            </span>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-300 mb-1">{tr('importantDisclaimer', lang)}</p>
            <p className="text-sm text-amber-200/80">{tr('disclaimer', lang)}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">{tr('startFreeTrial', lang)}</h2>
        <p className="text-slate-400 mb-6">{tr('noPaymentRequired', lang)}</p>
        <button
          onClick={onTrial}
          className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-xl font-medium transition inline-flex items-center gap-2 shadow-lg shadow-teal-600/30"
        >
          {tr('startFreeTrial', lang)}
          <ForwardIcon className="w-5 h-5" />
        </button>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-slate-500 text-sm">
        <p>VetRay — {tr('tagline', lang)}</p>
      </footer>
    </div>
  );
}
