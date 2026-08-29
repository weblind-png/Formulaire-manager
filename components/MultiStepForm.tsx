'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FUNCTIONS = ['CIO', 'DSI', 'DG', 'DAF', 'DRH'] as const;
const DURATIONS = [30, 60, 90, 180];
const ENTRY_CONTEXTS = [
  'Remplacement d\u2019urgence',
  'Cr\u00e9ation de poste',
  'Sortie de crise',
  'Phase de croissance',
  'Cession / fusion',
];

export default function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    company_url: '',
    target_function: '' as typeof FUNCTIONS[number] | '',
    mission_description: '',
    mission_duration_days: 90,
    entry_context: '',
    sponsor_mandate: '',
    team_size: '',
    known_constraints: '',
  });

  const update = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  // Étape 1 : crée la mission dès que l'URL + le premier bloc sont saisis
  async function submitStepOne() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        let message = text;
        try { message = JSON.parse(text).error ?? text; } catch {}
        throw new Error(message || `Erreur serveur (${res.status})`);
      }

      const data = await res.json();
      setMissionId(data.id);
      setStep(2);
    } catch (e: any) {
      setError(e.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  // Étape 2 : complète le contexte, puis part vers la synthèse/paywall
  async function submitStepTwo() {
    if (!missionId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/mission', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: missionId,
          entry_context: form.entry_context,
          sponsor_mandate: form.sponsor_mandate,
          team_size: form.team_size ? Number(form.team_size) : null,
          known_constraints: form.known_constraints,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        let message = text;
        try { message = JSON.parse(text).error ?? text; } catch {}
        throw new Error(message || `Erreur serveur (${res.status})`);
      }

      router.push(`/mission/${missionId}/summary`);
    } catch (e: any) {
      setError(e.message || 'Une erreur est survenue. Réessayez.');
      setLoading(false);
    }
  }

  return (
    <div className="form-card">
      {error && <p className="form-error">⚠️ {error}</p>}
      {step === 1 && (
        <div className="form-step">
          <h2>Votre mission en un coup d'œil</h2>
          <label>
            Site de l'entreprise cible
            <input
              type="url"
              placeholder="https://..."
              value={form.company_url}
              onChange={(e) => update('company_url', e.target.value)}
            />
          </label>

          <label>
            Votre fonction sur la mission
            <select
              value={form.target_function}
              onChange={(e) => update('target_function', e.target.value)}
            >
              <option value="">Sélectionner</option>
              {FUNCTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </label>

          <label>
            Mission attendue
            <textarea
              placeholder="Ex : redresser la DSI, sécuriser la clôture comptable..."
              value={form.mission_description}
              onChange={(e) => update('mission_description', e.target.value)}
            />
          </label>

          <label>
            Durée prévue de la mission
            <select
              value={form.mission_duration_days}
              onChange={(e) => update('mission_duration_days', Number(e.target.value))}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>{d} jours</option>
              ))}
            </select>
          </label>

          <button
            disabled={loading || !form.company_url || !form.target_function || !form.mission_description}
            onClick={submitStepOne}
          >
            {loading ? 'Analyse en cours...' : 'Continuer'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="form-step">
          <h2>Affinons le contexte</h2>
          <label>
            Contexte d'entrée
            <select
              value={form.entry_context}
              onChange={(e) => update('entry_context', e.target.value)}
            >
              <option value="">Sélectionner</option>
              {ENTRY_CONTEXTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Mandat donné par le sponsor (CA, actionnaire, DG...)
            <textarea
              value={form.sponsor_mandate}
              onChange={(e) => update('sponsor_mandate', e.target.value)}
            />
          </label>

          <label>
            Taille de l'équipe concernée
            <input
              type="number"
              value={form.team_size}
              onChange={(e) => update('team_size', e.target.value)}
            />
          </label>

          <label>
            Contraintes connues
            <textarea
              value={form.known_constraints}
              onChange={(e) => update('known_constraints', e.target.value)}
            />
          </label>

          <button disabled={loading} onClick={submitStepTwo}>
            {loading ? 'Enregistrement...' : 'Voir ma synthèse de mission'}
          </button>
        </div>
      )}
    </div>
  );
}
