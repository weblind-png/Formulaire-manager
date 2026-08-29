import { supabaseAdmin } from '@/lib/supabase';
import AdminGenerateButton from '@/components/AdminGenerateButton';

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

      {guideline ? (
        <>
          <h2 style={{ marginTop: 32 }}>{guideline.mission_title}</h2>
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
        </>
      ) : (
        <p style={{ marginTop: 20 }}>Pas encore générée — cliquez sur le bouton ci-dessus.</p>
      )}
    </main>
  );
}
