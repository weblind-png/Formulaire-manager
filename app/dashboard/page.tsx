import { createSupabaseServerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import HeroBanner from '@/components/HeroBanner';
import LogoutButton from '@/components/LogoutButton';
import SendEmailButton from '@/components/SendEmailButton';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: missions } = await supabaseAdmin
    .from('missions')
    .select('id, company_name, company_url, target_function, mission_duration_days, status, created_at, guideline_json')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <HeroBanner title="Mon espace" subtitle={user.email ?? ''} />
      <main className="page-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Link href="/"><button>+ Nouvelle mission</button></Link>
          <LogoutButton />
        </div>

        {!missions?.length && <p>Aucune mission pour le moment.</p>}

        <div className="dashboard-list">
          {missions?.map((m) => {
            const isReady = m.status === 'paid' || m.status === 'generated';
            return (
              <div key={m.id} className="dashboard-card">
                <div>
                  <h3>{m.company_name || m.company_url}</h3>
                  <p className="dashboard-meta">
                    {m.target_function} · {m.mission_duration_days} jours ·{' '}
                    {new Date(m.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  <span className={`status-badge status-${m.status}`}>{m.status}</span>
                </div>
                <div className="dashboard-actions">
                  {isReady ? (
                    <>
                      <Link href={`/mission/${m.id}/guideline`}>Voir la guideline</Link>
                      <a href={`/api/pdf/${m.id}`}>Télécharger le PDF</a>
                      <SendEmailButton missionId={m.id} defaultEmail={user.email ?? ''} />
                    </>
                  ) : (
                    <Link href={`/mission/${m.id}/summary`}>Reprendre / payer</Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
