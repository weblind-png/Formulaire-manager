'use client';

import { useState } from 'react';

export default function SendEmailButton({ missionId, defaultEmail }: { missionId: string; defaultEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    const email = prompt('Envoyer le PDF à quelle adresse ?', defaultEmail);
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/mission/${missionId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSent(true);
        setTimeout(() => setSent(false), 4000);
      } else {
        alert(data.error || "Erreur lors de l'envoi. Réessayez plus tard.");
      }
    } catch {
      alert('Erreur réseau. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <a onClick={handleSend} style={{ cursor: 'pointer' }}>
      {loading ? 'Envoi...' : sent ? '✓ Envoyé' : 'Envoyer par email'}
    </a>
  );
}
