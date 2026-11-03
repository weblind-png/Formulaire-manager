import Link from 'next/link';
import LegalLayout, { Field as F } from '@/components/LegalLayout';
import { LEGAL } from '@/lib/legal-config';

export const metadata = { title: `CGV / CGU — ${LEGAL.brand}` };

export default function CgvPage() {
  return (
    <LegalLayout title="Conditions générales de vente et d'utilisation" updated={LEGAL.lastUpdate}>
      <h2>1. Objet et champ d'application</h2>
      <p>
        Les présentes conditions générales de vente et d'utilisation (« CGV / CGU ») régissent
        l'accès et l'utilisation du service <strong>{LEGAL.serviceName}</strong> (le « Service »),
        édité sous le nom commercial {LEGAL.brand} (l'« Éditeur »), accessible à l'adresse{' '}
        {LEGAL.siteUrl}, ainsi que la vente des guidelines de mission qu'il génère. Toute création
        de compte ou toute commande implique l'acceptation pleine et entière des présentes.
        L'identité de l'Éditeur figure dans les <Link href="/mentions-legales">mentions légales</Link>.
      </p>

      <h2>2. Utilisateurs concernés</h2>
      <p>
        Le Service s'adresse exclusivement à des professionnels (managers de transition,
        dirigeants, consultants, cabinets, etc.) agissant dans le cadre de leur activité
        professionnelle. Il n'est pas destiné aux consommateurs au sens du Code de la consommation.
        En créant un compte, l'utilisateur déclare agir à des fins professionnelles.
      </p>

      <h2>3. Description du Service</h2>
      <p>
        Le Service permet à l'utilisateur de renseigner une entreprise cliente (nom, site
        internet), sa fonction et les caractéristiques de sa mission. À partir de ces informations
        et de sources accessibles publiquement, un moteur d'intelligence artificielle génère une
        guideline structurée en phases (objectifs, actions, livrables, indicateurs de succès,
        risques identifiés), consultable en ligne, assortie d'un suivi d'avancement par cases à
        cocher et exportable au format PDF.
      </p>
      <p>
        Le formulaire et la synthèse préliminaire de l'entreprise sont accessibles gratuitement
        après création d'un compte. La guideline complète et son export PDF sont accessibles après
        paiement.
      </p>

      <h2>4. Compte utilisateur</h2>
      <p>
        L'accès au Service nécessite la création d'un compte (adresse email et mot de passe).
        L'utilisateur s'engage à fournir des informations exactes, à préserver la confidentialité de
        ses identifiants et à informer l'Éditeur de tout usage non autorisé. Toute action réalisée
        depuis le compte est réputée effectuée par l'utilisateur. Un compte est destiné à une seule
        personne.
      </p>

      <h2>5. Prix et paiement</h2>
      <p>
        Le prix applicable est celui affiché sur la page de paiement avant la validation de la
        commande, en euros, avec la mention du régime de TVA applicable (<F value={LEGAL.vatNote} />).
      </p>
      <p>
        Un paiement unique donne accès à la guideline d'une mission (une entreprise cliente). Il
        ouvre droit, pour cette mission, à la consultation en ligne, au suivi de l'avancement par
        l'utilisateur et au téléchargement du PDF, sans limite de nombre et sans supplément. Une
        nouvelle mission, pour une autre entreprise cliente, fait l'objet d'un nouveau paiement.
      </p>
      <p>
        Le paiement s'effectue par carte bancaire via le prestataire sécurisé Stripe. L'Éditeur n'a
        pas accès aux numéros de carte. La commande est définitive après confirmation du paiement.
        Une facture est établie pour chaque commande et mise à disposition de l'utilisateur sur
        demande à <F value={LEGAL.email} />.
      </p>

      <h2>6. Fourniture du contenu</h2>
      <p>
        Le contenu est numérique et fourni immédiatement après confirmation du paiement (la
        génération peut prendre quelques dizaines de secondes). L'utilisateur y accède depuis son
        espace personnel.
      </p>

      <h2>7. Rétractation et remboursement</h2>
      <p>
        Le Service étant réservé aux professionnels, le droit de rétractation prévu par le Code de
        la consommation ne s'applique pas. Le contenu numérique étant fourni immédiatement après
        paiement, aucun remboursement n'est dû une fois la guideline générée, sauf défaut technique
        imputable à l'Éditeur empêchant durablement l'accès à la guideline ou au PDF : dans ce cas,
        l'Éditeur corrige le défaut dans les meilleurs délais ou, à défaut, rembourse la commande
        concernée.
      </p>

      <h2>8. Nature des guidelines et limites</h2>
      <p>L'utilisateur reconnaît que :</p>
      <ul>
        <li>
          les guidelines sont générées par intelligence artificielle et peuvent comporter des
          inexactitudes, des omissions ou des informations obsolètes, notamment sur l'entreprise
          cible et son secteur ;
        </li>
        <li>
          elles constituent une aide à la préparation et à la structuration de la mission, et non
          un conseil juridique, financier, fiscal, social ou stratégique personnalisé ;
        </li>
        <li>
          il lui appartient de vérifier les informations et d'adapter le plan à la réalité de sa
          mission avant toute décision ou toute diffusion à un tiers ;
        </li>
        <li>
          l'Éditeur ne peut être tenu responsable des décisions prises sur la base d'une guideline.
        </li>
      </ul>

      <h2>9. Obligations de l'utilisateur et données saisies</h2>
      <p>L'utilisateur s'engage à :</p>
      <ul>
        <li>fournir des informations licites et ne saisir que des informations dont il a le droit de faire usage, en particulier au regard de ses obligations de confidentialité, de non-divulgation (NDA) ou de secret professionnel envers ses propres clients ;</li>
        <li>éviter de saisir des données personnelles de tiers (noms de salariés, données RH nominatives, etc.) ou des secrets d'affaires non nécessaires à la génération de la guideline ;</li>
        <li>ne pas utiliser le Service à des fins illicites, ne pas tenter de contourner les mécanismes de paiement, d'accès ou de sécurité, ne pas extraire de manière automatisée les contenus du Service ;</li>
        <li>ne pas revendre ni redistribuer le Service lui-même.</li>
      </ul>
      <p>
        Les informations saisies sont traitées par des prestataires d'intelligence artificielle et de
        recherche, décrits dans la <Link href="/confidentialite">politique de confidentialité</Link>.
        L'utilisateur reste seul responsable du contenu qu'il saisit.
      </p>

      <h2>10. Propriété intellectuelle</h2>
      <p>
        Le Service, son code, ses interfaces, ses modèles de présentation, sa marque et ses contenus
        sont la propriété de l'Éditeur. L'utilisateur bénéficie, pour la durée de son accès, d'un
        droit d'usage personnel, non exclusif et non transférable du Service. Les informations
        saisies par l'utilisateur restent sa propriété.
      </p>
      <p>
        Les guidelines générées pour une mission payée peuvent être librement utilisées,
        reproduites et transmises par l'utilisateur (notamment à son client ou à son sponsor) dans le
        cadre de ses activités professionnelles. L'utilisateur ne peut en revanche ni revendre le
        Service lui-même, ni constituer à partir de celui-ci une offre concurrente.
      </p>

      <h2>11. Disponibilité et évolution du Service</h2>
      <p>
        L'Éditeur met en œuvre les moyens raisonnables pour assurer l'accès au Service, sans
        garantie de disponibilité continue (maintenance, incidents, indisponibilité de prestataires
        tiers). Le Service peut évoluer à tout moment.
      </p>

      <h2>12. Responsabilité</h2>
      <p>
        L'Éditeur est tenu à une obligation de moyens. Dans les limites permises par la loi, sa
        responsabilité est exclue pour les dommages indirects (perte de chiffre d'affaires, de
        mission ou d'opportunité, atteinte à l'image, etc.) et, toutes causes confondues, est
        limitée au montant effectivement payé par l'utilisateur pour la mission concernée. Ces
        limitations ne s'appliquent pas en cas de faute lourde ou dolosive, ni lorsque la loi
        l'interdit.
      </p>

      <h2>13. Données personnelles</h2>
      <p>
        Le traitement des données personnelles est décrit dans la{' '}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>14. Force majeure</h2>
      <p>
        L'Éditeur n'est pas responsable d'un manquement dû à un événement de force majeure au sens
        de l'article 1218 du Code civil, y compris une défaillance d'un opérateur de réseau ou d'un
        prestataire d'hébergement.
      </p>

      <h2>15. Suspension et suppression du compte</h2>
      <p>
        L'utilisateur peut demander la suppression de son compte à tout moment à l'adresse{' '}
        <F value={LEGAL.email} />. Cette suppression ne donne lieu à aucun remboursement des
        guidelines déjà générées. L'Éditeur peut suspendre ou supprimer un compte en cas de
        manquement grave aux présentes.
      </p>

      <h2>16. Modification des conditions</h2>
      <p>
        La version applicable à une commande est celle en vigueur à la date de cette commande.
        L'Éditeur peut modifier les présentes conditions ; la nouvelle version est publiée sur le
        site avec sa date de mise à jour.
      </p>

      <h2>17. Droit applicable et litiges</h2>
      <p>
        Les présentes sont soumises au droit français. En cas de litige, les parties recherchent
        d'abord une solution amiable. À défaut, les tribunaux compétents du ressort du siège de
        l'Éditeur sont seuls compétents.
      </p>
    </LegalLayout>
  );
}
