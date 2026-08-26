import { supabaseAdmin } from '@/lib/supabase';
import PayButton from '@/components/PayButton';
import { redirect } from 'next/navigation';

export default async function SummaryPage({ params }: { params: { id: string } }) {
  const { data: mission } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!mission) return <p>Mission introuvable.</p>;

  // Déjà payée : on ne repasse pas par le paywall
  if (mission.status === 'paid' || mission.status === 'generated') {
    redirect(`/mission/${params.id}/guideline`);
  }

  const phaseCount = Math.min(5, Math.max(2, Math.round(mission.mission_duration_days / 30)));
  const placeholderPhases = Array.from({ length: phaseCount }, (_, i) => `Phase ${i + 1}`);

  return (
    <main className="page">
      <h1>Votre synthèse de mission</h1>
      <section className="company-summary">
        <h3>{mission.company_url}</h3>
        <p>{mission.company_summary}</p>
      </section>

      <section className="teaser">
        <h2>Votre plan {mission.target_function} sur {mission.mission_duration_days} jours</h2>
        <ul className="locked-phases">
          {placeholderPhases.map((label) => (
            <li key={label} className="locked">
              🔒 {label} — objectifs, actions et livrables détaillés
            </li>
          ))}
        </ul>
        <p className="paywall-copy">
          Débloquez le document complet : plan step-by-step, actions concrètes
          (audit, consultation interne, rapport, directive, projet) et livrables
          par phase, formaté et téléchargeable.
        </p>
        <PayButton missionId={mission.id} />
      </section>
    </main>
  );
}
