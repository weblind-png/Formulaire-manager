import Link from 'next/link';
import LegalLayout, { Field as F } from '@/components/LegalLayout';
import { LEGAL } from '@/lib/legal-config';

export const metadata = { title: `Politique de confidentialité — ${LEGAL.brand}` };

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updated={LEGAL.lastUpdate}>
      <p>
        Cette politique explique comment {LEGAL.brand} traite les données personnelles dans le
        cadre du service {LEGAL.serviceName}, conformément au règlement (UE) 2016/679 (RGPD) et à
        la loi Informatique et Libertés.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        <F value={LEGAL.legalName} />, exerçant sous le nom commercial {LEGAL.brand} — adresse :{' '}
        <F value={LEGAL.address} /> — contact : <F value={LEGAL.email} />.
      </p>

      <h2>2. Données collectées</h2>
      <ul>
        <li><strong>Compte :</strong> adresse email, mot de passe (conservé sous forme hachée par le service d'authentification), date de création.</li>
        <li><strong>Missions :</strong> nom de l'entreprise cliente et adresse de son site internet, nom du manager, fonction, description et contexte de la mission (durée, contexte d'entrée, mandat du sponsor, taille de l'équipe, contraintes, axes stratégiques), suivi d'avancement (cases cochées).</li>
        <li><strong>Contenus générés :</strong> synthèse de l'entreprise, secteur d'activité, contexte de marché et guideline.</li>
        <li><strong>Paiement :</strong> les paiements sont traités par Stripe. Nous ne conservons ni numéro de carte ni cryptogramme, uniquement l'identifiant de la session de paiement et son statut.</li>
        <li><strong>Données techniques :</strong> adresse IP et données de connexion, utilisées pour la sécurité, la protection anti-robot et le diagnostic.</li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>Création et gestion du compte, génération et mise à disposition des guidelines, envoi du PDF par email à votre demande, emails de service (confirmation de compte, réinitialisation du mot de passe) : exécution du contrat.</li>
        <li>Paiement, facturation et comptabilité : exécution du contrat et obligation légale.</li>
        <li>Sécurité du Service et prévention des abus (protection anti-robot) : intérêt légitime.</li>
      </ul>
      <p>Nous ne vendons ni ne louons vos données.</p>

      <h2>4. Destinataires et prestataires</h2>
      <p>Pour fournir le Service, nous faisons appel aux prestataires suivants, qui agissent pour notre compte :</p>
      <ul>
        <li><strong>Supabase</strong> : base de données et authentification (données hébergées dans l'Union européenne, région de Paris).</li>
        <li><strong>Vercel</strong> : hébergement et exécution de l'application.</li>
        <li><strong>Stripe</strong> : paiement en ligne.</li>
        <li><strong>Groq</strong> : moteur d'intelligence artificielle qui génère la synthèse et la guideline à partir des informations saisies.</li>
        <li><strong>Tavily</strong> : recherche web utilisée pour enrichir le contexte sur l'entreprise et son secteur (les requêtes contiennent le nom ou l'adresse du site de l'entreprise et son secteur).</li>
        <li><strong>Cloudflare (Turnstile)</strong> : protection anti-robot du formulaire.</li>
        <li><strong>OVH</strong> : envoi des emails d'authentification.</li>
        <li><strong>Resend</strong> : envoi du PDF par email, uniquement lorsque vous en faites la demande depuis votre espace.</li>
      </ul>
      <p>
        Les informations que vous saisissez dans le formulaire sont transmises au prestataire
        d'intelligence artificielle pour générer votre guideline. Nous vous invitons à ne pas y
        inclure de données personnelles de tiers ni d'informations confidentielles non nécessaires.
      </p>

      <h2>5. Transferts hors Union européenne</h2>
      <p>
        Certains prestataires sont établis hors de l'Union européenne, notamment aux États-Unis.
        Lorsque c'est le cas, les transferts reposent sur les garanties prévues par le RGPD
        (décision d'adéquation, notamment le cadre de protection des données UE–États-Unis pour les
        entreprises certifiées, ou clauses contractuelles types de la Commission européenne).
      </p>

      <h2>6. Durées de conservation</h2>
      <ul>
        <li>Compte et missions : pendant la durée d'utilisation du Service, puis 3 ans maximum après la dernière activité, sauf demande de suppression anticipée.</li>
        <li>Données de facturation et de paiement : 10 ans (obligations comptables).</li>
        <li>Journaux techniques : durée limitée, nécessaire à la sécurité et au diagnostic.</li>
      </ul>

      <h2>7. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures adaptées : chiffrement des échanges (HTTPS), mots de
        passe hachés, identifiants uniques non devinables pour les documents, accès à la base de
        données restreint, sécurité des paiements déléguée à Stripe.
      </p>

      <h2>8. Vos droits</h2>
      <p>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition
        et de portabilité de vos données, ainsi que du droit de définir des directives relatives à
        leur sort après votre décès. Pour les exercer, écrivez à <F value={LEGAL.email} /> ; nous
        répondons dans un délai d'un mois, et pouvons demander un justificatif d'identité en cas de
        doute. Vous pouvez également introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
      </p>

      <h2>9. Cookies et traceurs</h2>
      <p>
        Le site utilise uniquement des cookies et traceurs strictement nécessaires à son
        fonctionnement : maintien de votre session de connexion et mécanisme anti-robot. Ils ne
        requièrent pas de consentement. Aucun cookie publicitaire ni outil de mesure d'audience
        n'est utilisé à ce jour.
      </p>

      <h2>10. Modification de la politique</h2>
      <p>
        Cette politique peut évoluer ; la version en vigueur est celle publiée sur cette page, avec
        sa date de mise à jour. Voir aussi les <Link href="/cgv">CGV / CGU</Link> et les{' '}
        <Link href="/mentions-legales">mentions légales</Link>.
      </p>
    </LegalLayout>
  );
}
