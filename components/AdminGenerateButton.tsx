'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGenerateButton({ missionId, adminKey }: { missionId: string; adminKey: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch('/api/admin/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId, key: adminKey }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Erreur lors de la génération — vérifiez les Runtime Logs Vercel.");
  }

  return (
    <button onClick={handleGenerate} disabled={loading}>
      {loading ? 'Génération en cours...' : 'Générer / régénérer la guideline (sans paiement)'}
    </button>
  );
}
