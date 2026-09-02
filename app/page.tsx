import MultiStepForm from '@/components/MultiStepForm';
import HeroBanner from '@/components/HeroBanner';

export default function HomePage() {
  return (
    <>
      <HeroBanner
        title="Votre plan d'action de mission, en 5 minutes"
        subtitle="Renseignez l'entreprise et la mission attendue. Nous générons votre guideline step-by-step — audit, consultations, rapports, directives — calée sur la durée réelle de votre mission."
      />
      <main className="page-body">
        <MultiStepForm />
      </main>
    </>
  );
}
