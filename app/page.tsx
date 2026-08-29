import MultiStepForm from '@/components/MultiStepForm';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <h1>Votre plan d'action de mission, en 5 minutes</h1>
          <p>
            Renseignez l'entreprise et la mission attendue. Nous générons votre guideline
            step-by-step — audit, consultations, rapports, directives — calée sur la durée
            réelle de votre mission.
          </p>
        </div>
      </section>
      <main className="page-body">
        <MultiStepForm />
      </main>
    </>
  );
}
