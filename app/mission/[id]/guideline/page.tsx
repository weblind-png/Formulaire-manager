import { supabaseAdmin } from '@/lib/supabase';
import { generateGuideline } from '@/lib/anthropic';
import { redirect } from 'next/navigation';
import type { Mission } from '@/lib/types';

export default async function GuidelinePage({ params }: { params: { id: string } }) {
  const { data: mission } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!mission) return <p>Mission introuvable.</p>;

  // Double vérification côté serveur : même en accédant directement à cette URL,
  // rien ne s'affiche sans que le webhook Stripe ait confirmé le paiement.
  if (mission.status !== 'paid' && mission.status !== 'generated') {
    redirect(`/mission/${params.id}/summary`);
  }

  let guideline = mission.guideline_json;
  if (!guideline) {
    guideline = await generateGuideline(mission as Mission);
    await supabaseAdmin
      .from('missions')
      .update({ status: 'generated', guideline_json: guideline })
      .eq('id', mission.id);
  }

  return (
    <main className="page">
      <h1>{guideline.mission_title}</h1>
      <p className="summary">{guideline.summary}</p>

      {guideline.phases.map((phase: any, i: number) => (
        <section key={i} className="phase-card">
          <h2>{phase.period_label} — {phase.title}</h2>

          <h4>Objectifs</h4>
          <ul>{phase.objectives.map((o: string, j: number) => <li key={j}>{o}</li>)}</ul>

          <h4>Actions</h4>
          <ul>{phase.actions.map((a: string, j: number) => <li key={j}>{a}</li>)}</ul>

          <h4>Livrables</h4>
          <ul>{phase.deliverables.map((d: string, j: number) => <li key={j}>{d}</li>)}</ul>
        </section>
      ))}

      <a className="download-link" href={`/api/pdf/${mission.id}`}>
        Télécharger le document formaté (PDF)
      </a>
    </main>
  );
}
