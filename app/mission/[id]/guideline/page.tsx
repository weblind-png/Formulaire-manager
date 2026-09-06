import { supabaseAdmin } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';
import { generateGuideline } from '@/lib/ai';
import { redirect } from 'next/navigation';
import type { Mission } from '@/lib/types';
import InteractiveGuideline from '@/components/InteractiveGuideline';

export default async function GuidelinePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { id } = await params;
  const { session_id } = await searchParams;

  let { data: mission } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();

  if (!mission) return <p>Mission introuvable.</p>;

  // Filet de sécurité : le webhook Stripe met à jour le statut de façon
  // asynchrone et peut avoir quelques secondes de retard sur la redirection
  // du navigateur. Si on revient tout juste de Stripe (session_id présent)
  // et que le statut n'est pas encore "paid", on vérifie DIRECTEMENT auprès
  // de Stripe plutôt que d'attendre le webhook — évite un renvoi à tort vers
  // la page de paiement pour un manager qui vient pourtant de payer.
  if (mission.status !== 'paid' && mission.status !== 'generated' && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === 'paid' && session.metadata?.missionId === id) {
        await supabaseAdmin
          .from('missions')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('id', id);
        mission = { ...mission, status: 'paid' };
      }
    } catch (err) {
      console.error('Vérification Stripe directe échouée', err);
    }
  }

  // Double vérification côté serveur : même en accédant directement à cette URL,
  // rien ne s'affiche sans que le paiement soit confirmé (webhook ou vérification directe).
  if (mission.status !== 'paid' && mission.status !== 'generated') {
    redirect(`/mission/${id}/summary`);
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

      <InteractiveGuideline
        missionId={mission.id}
        guideline={guideline}
        initialProgress={mission.progress_json ?? {}}
        missionDurationDays={mission.mission_duration_days}
        startedAt={mission.paid_at ?? mission.created_at}
      />

      <a className="download-link" href={`/api/pdf/${mission.id}`}>
        Télécharger le document formaté (PDF)
      </a>
    </main>
  );
}
