import { useState, useEffect } from 'react';
import type { Lang } from '@/types';
import { tr } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { Mail, KeyRound, ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Brain, Shield } from 'lucide-react';

export function AuthScreen({ lang, onAuthSuccess, onBack }: { lang: Lang; onAuthSuccess: () => void; onBack: () => void }) {
  const { signInWithOtp, verifyOtp, ensureProfile } = useAuth();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const dir = lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr';
  const BackIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const ForwardIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setError(tr('enterEmail', lang));
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signInWithOtp(email, lang);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setStep('code');
      setResendTimer(60);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError(tr('enterCode', lang));
      return;
    }
    if (attempts >= 5) {
      setError(tr('tooManyAttempts', lang));
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await verifyOtp(email, code);
    setLoading(false);
    if (error) {
      setAttempts(attempts + 1);
      setError(tr('invalidCode', lang));
    } else {
      await ensureProfile(lang);
      onAuthSuccess();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    const { error } = await signInWithOtp(email, lang);
    setLoading(false);
    if (!error) {
      setResendTimer(60);
      setAttempts(0);
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-500/20 rounded-2xl mb-3">
            <Brain className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">VetRay</h1>
          <p className="text-slate-400 text-xs">{tr('tagline', lang)}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {step === 'email' && (
            <>
              <label className="block text-sm font-medium text-slate-300 mb-2">{tr('email', lang)}</label>
              <div className="relative mb-4">
                <Mail className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                  placeholder={tr('enterEmail', lang)}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? tr('loading', lang) : tr('sendCode', lang)}
                {!loading && <ForwardIcon className="w-4 h-4" />}
              </button>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="flex items-center gap-2 text-teal-400 text-sm mb-4">
                <Shield className="w-4 h-4" />
                {tr('codeSent', lang)}
              </div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{tr('enterCode', lang)}</label>
              <div className="relative mb-4">
                <KeyRound className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  placeholder="000000"
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl tracking-widest placeholder-slate-600 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm mb-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl font-medium transition disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
              >
                {loading ? tr('loading', lang) : tr('verify', lang)}
              </button>
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="w-full text-slate-400 hover:text-teal-400 text-sm py-2 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                {tr('resendCode', lang)} {resendTimer > 0 && `(${resendTimer}s)`}
              </button>
            </>
          )}
        </div>

        <button onClick={onBack} className="mt-4 text-slate-400 hover:text-white text-sm flex items-center gap-1 mx-auto transition">
          <BackIcon className="w-4 h-4" /> {tr('back', lang)}
        </button>
      </div>
    </div>
  );
}
