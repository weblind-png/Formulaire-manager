import { supabaseAdmin } from '@/lib/supabase';
import { generateGuideline } from '@/lib/ai';
import { redirect } from 'next/navigation';
import type { Mission } from '@/lib/types';
import InteractiveGuideline from '@/components/InteractiveGuideline';

export default async function GuidelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: mission } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();

  if (!mission) return <p>Mission introuvable.</p>;

  // Double vérification côté serveur : même en accédant directement à cette URL,
  // rien ne s'affiche sans que le webhook Stripe ait confirmé le paiement.
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
