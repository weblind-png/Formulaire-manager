import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import MultiStepForm from '@/components/MultiStepForm';
import HeroBanner from '@/components/HeroBanner';

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <>
      <HeroBanner
        title="Votre plan d'action de mission, en 5 minutes"
        subtitle="Renseignez l'entreprise et la mission attendue. Nous générons votre guideline step-by-step — audit, consultations, rapports, directives — calée sur la durée réelle de votre mission."
      />
      <main className="page-body">
        <p style={{ marginBottom: 16 }}>
          <a href="/dashboard">← Retour à mon espace</a>
        </p>
        <MultiStepForm />
      </main>
    </>
  );
}
