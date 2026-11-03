'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import HeroBanner from '@/components/HeroBanner';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setInfo(null);

    if (mode === 'signup') {
      // Précise explicitement la destination du lien de confirmation, plutôt
      // que de laisser Supabase utiliser le "Site URL" par défaut du projet.
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      setLoading(false);
      if (error) return setError(error.message);
      setInfo('Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.');
      setMode('login');
      return;
    }

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) return setError(error.message);
      setInfo('Si un compte existe avec cet email, un lien de réinitialisation vient de vous être envoyé.');
      setMode('login');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push('/');
    router.refresh();
  }

  const titles = { login: 'Connexion', signup: 'Créer votre compte', forgot: 'Mot de passe oublié' };

  return (
    <>
      <HeroBanner title={titles[mode]} />
      <main className="page-body">
        <div className="form-card" style={{ maxWidth: 420, margin: '0 auto' }}>
          {error && <p className="form-error">⚠️ {error}</p>}
          {info && <p className="form-info">{info}</p>}

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          {mode !== 'forgot' && (
            <label>
              Mot de passe
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
          )}

          {mode === 'signup' && (
            <label className="checklist-item" style={{ marginBottom: 16 }}>
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
              <span>
                J'accepte les{' '}
                <a href="/cgv" target="_blank" rel="noopener noreferrer">CGV / CGU</a> et la{' '}
                <a href="/confidentialite" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>.
              </span>
            </label>
          )}

          <button
            disabled={loading || !email || (mode !== 'forgot' && !password) || (mode === 'signup' && !accepted)}
            onClick={handleSubmit}
          >
            {loading
              ? 'Patientez...'
              : mode === 'login' ? 'Se connecter'
              : mode === 'signup' ? 'Créer mon compte'
              : 'Envoyer le lien de réinitialisation'}
          </button>

          <p className="auth-switch">
            {mode === 'login' && (
              <>
                Pas encore de compte ? <a onClick={() => setMode('signup')}>Créer un compte</a>
                <br />
                <a onClick={() => setMode('forgot')}>Mot de passe oublié ?</a>
              </>
            )}
            {mode === 'signup' && (
              <>Déjà un compte ? <a onClick={() => setMode('login')}>Se connecter</a></>
            )}
            {mode === 'forgot' && (
              <>
                <a onClick={() => setMode('login')}>← Retour à la connexion</a>
              </>
            )}
          </p>
        </div>
      </main>
    </>
  );
}

