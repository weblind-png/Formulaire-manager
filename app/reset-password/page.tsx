'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import HeroBanner from '@/components/HeroBanner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) return setError(error.message);
    setDone(true);
    setTimeout(() => router.push('/login'), 2000);
  }

  return (
    <>
      <HeroBanner title="Nouveau mot de passe" />
      <main className="page-body">
        <div className="form-card" style={{ maxWidth: 420, margin: '0 auto' }}>
          {error && <p className="form-error">⚠️ {error}</p>}
          {done ? (
            <p className="form-info">Mot de passe mis à jour ! Redirection vers la connexion...</p>
          ) : (
            <>
              <label>
                Nouveau mot de passe
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
              <button disabled={loading || password.length < 6} onClick={handleSubmit}>
                {loading ? 'Patientez...' : 'Mettre à jour le mot de passe'}
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
