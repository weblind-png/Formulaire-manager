
// Informations légales centralisées : renseignez les champs « À COMPLÉTER »
// une seule fois ici, elles sont reprises dans toutes les pages légales
// (surlignées en jaune tant qu'elles ne sont pas remplies).
const todo = (hint: string) => `[À COMPLÉTER : ${hint}]`;

export const LEGAL = {
  brand: 'ITERIUM PARTNERS',
  serviceName: 'Guideline Manager de Transition',
  siteUrl: 'https://guideline.iteriumpartners.com',

  legalName: todo("nom et prénom de l'entrepreneur, ou dénomination sociale"),
  legalForm: 'Entrepreneur individuel (micro-entreprise)',
  siret: todo('numéro SIRET à 14 chiffres'),
  registry: todo('immatriculation RCS ou RM si applicable, sinon écrire « Non applicable »'),
  address: todo('adresse postale complète'),
  email: todo('adresse email de contact'),
  publicationDirector: todo('nom du directeur de la publication'),
  vatNote: todo('« TVA non applicable, art. 293 B du CGI » en franchise en base, sinon numéro de TVA intracommunautaire'),

  lastUpdate: '2 novembre 2026',

  host: {
    name: 'Vercel Inc.',
    address: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    url: 'https://vercel.com',
  },
};
