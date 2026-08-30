import { supabaseAdmin } from '@/lib/supabase';
import AdminGenerateButton from '@/components/AdminGenerateButton';
import InteractiveGuideline from '@/components/InteractiveGuideline';

export default async function AdminMissionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { id } = await params;
  const { key } = await searchParams;

  if (key !== process.env.ADMIN_SECRET) {
    return (
      <main className="page">
        <h1>Accès restreint</h1>
      </main>
    );
  }

  const { data: mission } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();

  if (!mission) return <main className="page"><p>Mission introuvable.</p></main>;

  const guideline = mission.guideline_json;

  return (
    <main className="page">
      <p><a href={`/admin?key=${key}`}>← Retour à la liste</a></p>
      <h1>{mission.company_url}</h1>
      <p>
        {mission.target_function} · {mission.mission_duration_days} jours ·
        statut : <strong>{mission.status}</strong>
      </p>

      <section className="company-summary">
        <h3>Synthèse entreprise (générée)</h3>
        <p>{mission.company_summary}</p>
      </section>

      <section className="company-summary">
        <h3>Détails saisis par le manager</h3>
        <p><strong>Mission :</strong> {mission.mission_description}</p>
        <p><strong>Contexte d'entrée :</strong> {mission.entry_context || '—'}</p>
        <p><strong>Mandat du sponsor :</strong> {mission.sponsor_mandate || '—'}</p>
        <p><strong>Taille équipe :</strong> {mission.team_size ?? '—'}</p>
        <p><strong>Contraintes :</strong> {mission.known_constraints || '—'}</p>
      </section>

      <AdminGenerateButton missionId={mission.id} adminKey={key!} />

      {guideline && (
        <p style={{ marginTop: 12 }}>
          <a href={`/api/pdf/${mission.id}?key=${key}`}>📄 Télécharger le PDF</a>
        </p>
      )}

      {guideline ? (
        <>
          <h2 style={{ marginTop: 32 }}>{guideline.mission_title}</h2>
          <p className="summary">{guideline.summary}</p>

          <InteractiveGuideline
            missionId={mission.id}
            guideline={guideline}
            initialProgress={mission.progress_json ?? {}}
            missionDurationDays={mission.mission_duration_days}
            startedAt={mission.paid_at ?? mission.created_at}
          />
        </>
      ) : (
        <p style={{ marginTop: 20 }}>Pas encore générée — cliquez sur le bouton ci-dessus.</p>
      )}
    </main>
  );
}
