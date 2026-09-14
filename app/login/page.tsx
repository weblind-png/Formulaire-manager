'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import HeroBanner from '@/components/HeroBanner';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setInfo(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
      setInfo('Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.');
      setMode('login');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError('Email ou mot de passe incorrect.');
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <HeroBanner title={mode === 'login' ? 'Connexion' : 'Créer votre compte'} />
      <main className="page-body">
        <div className="form-card" style={{ maxWidth: 420, margin: '0 auto' }}>
          {error && <p className="form-error">⚠️ {error}</p>}
          {info && <p className="form-info">{info}</p>}

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Mot de passe
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <button disabled={loading || !email || !password} onClick={handleSubmit}>
            {loading ? 'Patientez...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>

          <p className="auth-switch">
            {mode === 'login' ? (
              <>Pas encore de compte ? <a onClick={() => setMode('signup')}>Créer un compte</a></>
            ) : (
              <>Déjà un compte ? <a onClick={() => setMode('login')}>Se connecter</a></>
            )}
          </p>
        </div>
      </main>
    </>
  );
}
