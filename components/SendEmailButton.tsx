'use client';

import { useState } from 'react';

export default function SendEmailButton({ missionId, defaultEmail }: { missionId: string; defaultEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    const email = prompt('Envoyer le PDF à quelle adresse ?', defaultEmail);
    if (!email) return;

    setLoading(true);
    const res = await fetch(`/api/mission/${missionId}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);

    if (res.ok) {
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } else {
      alert("Erreur lors de l'envoi. Réessayez plus tard.");
    }
  }

  return (
    <a onClick={handleSend} style={{ cursor: 'pointer' }}>
      {loading ? 'Envoi...' : sent ? '✓ Envoyé' : 'Envoyer par email'}
    </a>
  );
}
