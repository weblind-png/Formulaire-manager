import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  if (key !== process.env.ADMIN_SECRET) {
    return (
      <main className="page">
        <h1>Accès restreint</h1>
        <p>Ajoutez <code>?key=votre_mot_de_passe</code> à l'URL pour accéder à l'espace admin.</p>
      </main>
    );
  }

  const { data: missions } = await supabaseAdmin
    .from('missions')
    .select('id, company_url, target_function, mission_duration_days, status, created_at')
    .order('created_at', { ascending: false });

  return (
    <main className="page">
      <h1>Missions générées</h1>
      <p>Vue créateur — consultez et validez le contenu des guidelines, payées ou non.</p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Créée le</th>
            <th>Entreprise</th>
            <th>Fonction</th>
            <th>Durée</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {missions?.map((m) => (
            <tr key={m.id}>
              <td>{new Date(m.created_at).toLocaleString('fr-FR')}</td>
              <td>{m.company_url}</td>
              <td>{m.target_function}</td>
              <td>{m.mission_duration_days} j</td>
              <td><span className={`status-badge status-${m.status}`}>{m.status}</span></td>
              <td>
                <Link href={`/admin/mission/${m.id}?key=${key}`}>Voir le détail →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!missions?.length && <p>Aucune mission pour le moment.</p>}
    </main>
  );
}
