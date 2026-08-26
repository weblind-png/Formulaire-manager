# Guideline Manager de Transition

Squelette complet remplaçant le combo Tally + Make + Groq : formulaire multi-étapes,
paywall Stripe, génération IA via Claude, sur votre stack habituelle
(Next.js 15 / Supabase / Vercel / Stripe).

## Principe du funnel

1. `/` — Formulaire multi-étapes (gratuit). Chaque étape sauvegarde en base
   (table `missions`) : rien n'est perdu, ça renforce l'attachement du manager.
2. `/mission/[id]/summary` — Synthèse "teaser" : titres des phases visibles,
   contenu verrouillé. Bouton de paiement Stripe Checkout.
3. **Webhook Stripe** (`/api/webhook/stripe`) — Seul endroit qui passe le statut
   de la mission à `paid`. Jamais depuis le front, jamais depuis l'URL de succès.
4. `/mission/[id]/guideline` — Vérifie le statut `paid` **côté serveur** avant
   de générer/afficher quoi que ce soit. Génère la guideline via Claude
   (`lib/anthropic.ts`) et la stocke en base pour ne pas repayer l'appel IA
   à chaque visite.

## Déploiement sans PC local (GitHub → Vercel)

1. Décompressez `transition-guide.zip` (n'importe où — Finder/Explorateur suffit,
   pas besoin de terminal).
2. Sur GitHub : **New repository** → nommez-le (ex. `transition-guide`) → créez-le vide,
   sans README ni .gitignore (les vôtres sont déjà dans le zip).
3. Dans le repo vide, cliquez **"uploading an existing file"**, puis **glissez-déposez
   tout le contenu du dossier décompressé** (pas le dossier lui-même, son contenu :
   `app/`, `components/`, `lib/`, `supabase/`, `package.json`, etc.) → **Commit changes**.
   GitHub recrée l'arborescence des sous-dossiers automatiquement.
4. Sur Vercel : **Add New → Project** → importez ce repo GitHub.
5. Dans les réglages du projet Vercel, onglet **Environment Variables** : ajoutez
   toutes les variables listées dans `.env.example` (Supabase, Stripe, Anthropic) —
   c'est l'équivalent du `.env.local`, mais **le `.env.local` lui-même ne doit jamais
   être commité** (il est exclu via `.gitignore`).
6. **Deploy**. Vercel installe les dépendances et build automatiquement — aucun `npm install`
   local nécessaire.

## Mise en route (si vous testez en local un jour)

```bash
npm install
cp .env.example .env.local
# Remplir les variables (Supabase, Stripe, Anthropic)
```

### Supabase
Exécuter `supabase/schema.sql` dans l'éditeur SQL de votre projet.

### Stripe
1. Créer un produit "Guideline manager de transition" avec un prix fixe.
2. Copier son Price ID dans `PRICE_GUIDELINE` (⚠️ ne pas préfixer par `STRIPE_`,
   Vercel remplace ces variables automatiquement — même piège que sur Iterium).
3. Configurer un webhook Stripe pointant vers `https://votre-domaine/api/webhook/stripe`,
   événement `checkout.session.completed`. Copier le signing secret dans
   `STRIPE_WEBHOOK_SECRET`.
4. En local, utiliser `stripe listen --forward-to localhost:3000/api/webhook/stripe`.

### Anthropic
Renseigner `ANTHROPIC_API_KEY`. Les prompts de génération sont dans `lib/anthropic.ts`,
un system prompt distinct par fonction (CIO/DSI/DG/DAF/DRH) — c'est là que vous
injectez vos trames métier propriétaires au fil du temps.

## À compléter

- **Scraping du site cible** : `app/api/mission/route.ts` contient un `TODO` —
  brancher un service de scraping réel (Firecrawl, ou scraping custom) à la place
  du texte placeholder avant l'appel à `summarizeCompany`.
- **Génération PDF** : le lien "Télécharger le PDF" pointe vers `/api/pdf/[id]`,
  route à créer avec `@react-pdf/renderer` (déjà dans les dépendances) à partir
  de `guideline_json`.
- **Auth manager** : le schéma prévoit une colonne `user_id` + RLS ; brancher
  Supabase Auth pour que chaque manager retrouve ses missions passées.
- **Design** : les styles dans `app/globals.css` sont volontairement neutres —
  à aligner sur l'identité visuelle d'ITERIUM PARTNERS si le produit y est adossé.
