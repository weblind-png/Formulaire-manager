import Link from 'next/link';
import LegalLayout, { Field as F } from '@/components/LegalLayout';
import { LEGAL } from '@/lib/legal-config';

export const metadata = { title: `Mentions légales — ${LEGAL.brand}` };

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updated={LEGAL.lastUpdate}>
      <p>
        Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
        l'économie numérique (LCEN), voici les informations relatives à l'éditeur et à l'hébergeur
        du site {LEGAL.siteUrl}.
      </p>

      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>{LEGAL.serviceName}</strong>, accessible à l'adresse {LEGAL.siteUrl}, est
        édité sous le nom commercial <strong>{LEGAL.brand}</strong> par :
      </p>
      <ul>
        <li>Nom / dénomination : <F value={LEGAL.legalName} /></li>
        <li>Forme juridique : {LEGAL.legalForm}</li>
        <li>SIRET : <F value={LEGAL.siret} /></li>
        <li>Immatriculation : <F value={LEGAL.registry} /></li>
        <li>Adresse : <F value={LEGAL.address} /></li>
        <li>Email : <F value={LEGAL.email} /></li>
        <li>TVA : <F value={LEGAL.vatNote} /></li>
      </ul>

      <h2>Directeur de la publication</h2>
      <p><F value={LEGAL.publicationDirector} /></p>

      <h2>Hébergement</h2>
      <ul>
        <li>
          Application web : {LEGAL.host.name}, {LEGAL.host.address} —{' '}
          <a href={LEGAL.host.url} target="_blank" rel="noopener noreferrer">{LEGAL.host.url}</a>
        </li>
        <li>
          Base de données et authentification : Supabase. Les données sont hébergées dans l'Union
          européenne (région de Paris, France).
        </li>
      </ul>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments du site (structure, textes, graphismes, logo, marque{' '}
        {LEGAL.brand}, code, bases de données) est protégé par le droit de la propriété
        intellectuelle et reste la propriété de l'éditeur, sauf mention contraire. Toute
        reproduction, représentation, extraction ou réutilisation, totale ou partielle, sans
        autorisation écrite préalable, est interdite.
      </p>
      <p>
        Les documents générés pour un utilisateur (guidelines et fichiers PDF) peuvent être
        utilisés par celui-ci dans le cadre de ses missions professionnelles, dans les conditions
        prévues par les <Link href="/cgv">conditions générales de vente et d'utilisation</Link>.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Les guidelines sont générées à l'aide d'une intelligence artificielle, à partir des
        informations saisies par l'utilisateur et de sources accessibles publiquement. Elles
        constituent une aide à la préparation d'une mission et ne remplacent pas l'analyse
        professionnelle de l'utilisateur ; elles ne constituent pas un conseil juridique,
        financier, fiscal ou social. L'éditeur s'efforce d'assurer l'exactitude et la
        disponibilité du site, sans garantir l'absence d'erreur ni une disponibilité ininterrompue.
      </p>

      <h2>Données personnelles et cookies</h2>
      <p>
        Le traitement des données personnelles et l'usage des cookies sont décrits dans la{' '}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Le présent site est soumis au droit français. En cas de litige, et sous réserve des règles
        de compétence impératives, les tribunaux français sont compétents.
      </p>

      <h2>Contact</h2>
      <p>Pour toute question : <F value={LEGAL.email} />.</p>
    </LegalLayout>
  );
}
