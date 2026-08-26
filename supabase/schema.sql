-- Table principale : une ligne = une mission saisie par un manager de transition
create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Étape 1 : entreprise cible
  company_url text not null,
  company_summary text,              -- généré par l'IA à partir du scraping du site

  -- Étape 2 : mission
  target_function text not null check (target_function in ('CIO','DSI','DG','DAF','DRH')),
  mission_description text not null,
  mission_duration_days int not null,     -- ex: 30, 60, 90, 180
  entry_context text,                     -- urgence, création de poste, crise, croissance, cession...
  sponsor_mandate text,                   -- mandat donné par le sponsor (CA, actionnaire, DG)
  team_size int,
  known_constraints text,

  -- État du funnel
  status text not null default 'draft' check (status in ('draft','ready_for_payment','paid','generated')),
  stripe_session_id text,
  paid_at timestamptz,

  -- Résultat
  guideline_json jsonb,              -- plan step-by-step structuré généré par Claude
  guideline_pdf_url text
);

alter table missions enable row level security;

-- Chaque utilisateur ne voit que ses propres missions (auth Supabase requise)
create policy "Users manage their own missions"
  on missions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table missions add column if not exists user_id uuid references auth.users(id);
