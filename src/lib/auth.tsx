import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile, Lang, UserRole, TrialState } from '@/types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  trialState: TrialState;
  daysRemaining: number;
  signInWithOtp: (email: string, lang: Lang) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  enterDemoMode: () => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
  ensureProfile: (lang: Lang) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const canUseLocalDemo = import.meta.env.DEV && typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const demoUser: UserProfile = {
  id: 'local-demo-user',
  email: 'demo@localhost',
  role: 'small_animal_vet',
  preferredLang: 'en',
  trialStartedAt: new Date().toISOString(),
  trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  subscribed: false,
  createdAt: new Date().toISOString(),
};

function mapNetworkError(lang: Lang, err: unknown): string {
  console.error('[Auth] Network error:', err);
  const messages: Record<Lang, string> = {
    fa: 'اتصال با سرور برقرار نشد. لطفاً اتصال اینترنت را بررسی کنید.',
    en: 'Could not connect to the server. Please check your internet connection.',
    ar: 'تعذّر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
    tr: 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
    fr: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
    es: 'No se pudo conectar al servidor. Verifique su conexión a internet.',
    de: 'Verbindung zum Server fehlgeschlagen. Bitte Internetverbindung prüfen.',
  };
  return messages[lang] || messages.en;
}

function mapAuthError(error: { message: string; status?: number }, lang: Lang): string {
  console.error('[Auth] Supabase error:', error.message, error.status);
  const msg = error.message.toLowerCase();
  if (error.status === 429 || msg.includes('rate limit')) return 'Too many requests. Please try again in a few minutes.';
  if (msg.includes('failed to fetch') || msg.includes('network')) return mapNetworkError(lang, error);
  if (msg.includes('invalid') && msg.includes('otp')) return 'Invalid verification code. Please try again.';
  if (msg.includes('expired')) return 'The verification code has expired. Please request a new code.';
  return error.message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const computeTrialState = (profile: UserProfile | null): { state: TrialState; days: number } => {
    if (!profile) return { state: 'trial_active', days: 0 };
    if (profile.subscribed) return { state: 'subscribed', days: 0 };
    if (!profile.trialEndsAt) return { state: 'trial_active', days: 7 };
    const days = Math.ceil((new Date(profile.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return { state: 'trial_expired', days: 0 };
    if (days <= 2) return { state: 'trial_expiring', days };
    return { state: 'trial_active', days };
  };

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle();
    if (error || !data) return null;
    return { id: data.id, email: data.email, role: data.role as UserRole | null, preferredLang: (data.preferred_lang as Lang) || 'fa', trialStartedAt: data.trial_started_at, trialEndsAt: data.trial_ends_at, subscribed: data.subscribed || false, createdAt: data.created_at };
  }, []);

  const ensureProfile = useCallback(async (lang: Lang) => {
    if (isDemo) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const existing = await fetchProfile(session.user.id);
    if (existing) { setUser(existing); return; }
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const newProfile = { id: session.user.id, email: session.user.email || '', role: null, preferred_lang: lang, trial_started_at: now.toISOString(), trial_ends_at: trialEnd.toISOString(), subscribed: false, subscription_status: 'TRIAL_ACTIVE' as const };
    const { error } = await supabase.from('user_profiles').insert(newProfile);
    if (!error) setUser({ id: newProfile.id, email: newProfile.email, role: null, preferredLang: lang, trialStartedAt: newProfile.trial_started_at, trialEndsAt: newProfile.trial_ends_at, subscribed: false, createdAt: now.toISOString() });
  }, [fetchProfile, isDemo]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) { const profile = await fetchProfile(session.user.id); if (mounted) setUser(profile); }
      if (mounted) setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) { const profile = await fetchProfile(session.user.id); if (mounted) setUser(profile); }
        else if (!isDemo && mounted) setUser(null);
        if (mounted) setLoading(false);
      })();
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [fetchProfile, isDemo]);

  const signInWithOtp = useCallback(async (email: string, lang: Lang) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
      return { error: error ? mapAuthError(error, lang) : null };
    } catch (err) { return { error: mapNetworkError(lang, err) }; }
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
      return { error: error ? mapAuthError(error, 'fa') : null };
    } catch (err) { return { error: mapNetworkError('fa', err) }; }
  }, []);

  const enterDemoMode = useCallback(() => {
    if (!canUseLocalDemo) return;
    setIsDemo(true);
    setUser({ ...demoUser });
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    if (isDemo) { setIsDemo(false); setUser(null); return; }
    await supabase.auth.signOut();
    setUser(null);
  }, [isDemo]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user' };
    if (isDemo) { setUser(prev => prev ? { ...prev, ...updates } : null); return { error: null }; }
    const dbUpdates: Record<string, unknown> = {};
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.preferredLang !== undefined) dbUpdates.preferred_lang = updates.preferredLang;
    if (updates.subscribed !== undefined) dbUpdates.subscribed = updates.subscribed;
    const { error } = await supabase.from('user_profiles').update(dbUpdates).eq('id', user.id);
    if (!error) setUser(prev => prev ? { ...prev, ...updates } : null);
    return { error: error?.message || null };
  }, [isDemo, user]);

  const { state: trialState, days: daysRemaining } = computeTrialState(user);
  return <AuthContext.Provider value={{ user, loading, trialState, daysRemaining, signInWithOtp, verifyOtp, enterDemoMode, signOut, updateProfile, ensureProfile }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
