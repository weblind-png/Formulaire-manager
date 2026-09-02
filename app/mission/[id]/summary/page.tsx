import { supabaseAdmin } from '@/lib/supabase';
import PayButton from '@/components/PayButton';
import HeroBanner from '@/components/HeroBanner';
import { redirect } from 'next/navigation';

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: mission } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();

  if (!mission) return <p>Mission introuvable.</p>;

  // Déjà payée : on ne repasse pas par le paywall
  if (mission.status === 'paid' || mission.status === 'generated') {
    redirect(`/mission/${id}/guideline`);
  }

  const phaseCount = Math.min(5, Math.max(2, Math.round(mission.mission_duration_days / 30)));
  const placeholderPhases = Array.from({ length: phaseCount }, (_, i) => `Phase ${i + 1}`);

  return (
    <>
      <HeroBanner title="Votre synthèse de mission" />
      <main className="page-body">
        <section className="company-summary">
          <h3>{mission.company_name || mission.company_url}</h3>
          <p>{mission.company_summary}</p>
          {mission.sector && (
            <p className="sector-tag">🏷️ Secteur identifié : {mission.sector}</p>
          )}
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
    </>
  );
}
