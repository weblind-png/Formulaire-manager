'use client';

import { useState } from 'react';

export default function PayButton({ missionId }: { missionId: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <button className="pay-button" onClick={handlePay} disabled={loading}>
      {loading ? 'Redirection vers le paiement...' : 'Débloquer ma guideline complète'}
    </button>
  );
}
