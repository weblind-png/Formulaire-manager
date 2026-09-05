import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { summarizeCompany, detectSector, searchSectorContext, searchCompanyContext } from '@/lib/ai';
import { scrapeCompanySite } from '@/lib/scraper';

// Vérifie le token Turnstile côté serveur — c'est la vraie protection, jamais
// le blocage du bouton côté client seul (un bot appelle l'API directement).
// Si TURNSTILE_SECRET_KEY n'est pas configurée, la vérification est ignorée
// (permet de développer/tester sans avoir configuré le captcha).
async function verifyCaptcha(token: string | undefined, ip: string | null): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// Création d'une mission (étape 1 du formulaire)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { company_url, company_name, manager_name, target_function, mission_description, mission_duration_days, captchaToken } = body;

  if (!company_url || !target_function || !mission_description || !mission_duration_days) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for');
  const captchaValid = await verifyCaptcha(captchaToken, ip);
  if (!captchaValid) {
    return NextResponse.json({ error: 'Vérification anti-robot échouée. Rechargez la page et réessayez.' }, { status: 403 });
  }

  const rawContent = await scrapeCompanySite(company_url);

  // Recherche web générale sur l'entreprise (nom si fourni, sinon domaine extrait
  // de l'URL) — comble les trous quand le site bloque le scraping (JS, anti-bot).
  let companyLabel = company_name;
  if (!companyLabel) {
    try { companyLabel = new URL(company_url).hostname.replace('www.', ''); } catch { companyLabel = company_url; }
  }
  const webContext = await searchCompanyContext(companyLabel);

  const company_summary = await summarizeCompany(company_url, rawContent, webContext);

  // Enrichissement sectoriel : identifie le secteur puis cherche le contexte
  // de marché réel (tendances 2026) — donne à l'IA une matière bien plus riche
  // qu'un simple résumé du site pour générer la guideline.
  const sector = await detectSector(company_summary);
  const sector_context = sector ? await searchSectorContext(sector) : '';

  const { data, error } = await supabaseAdmin
    .from('missions')
    .insert({
      company_url,
      company_name,
      manager_name,
      company_summary,
      target_function,
      mission_description,
      mission_duration_days,
      sector,
      sector_context,
      status: 'draft',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Mise à jour (étapes suivantes du formulaire) — sauvegarde progressive
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id manquant' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('missions')
    .update({ ...fields, status: 'ready_for_payment' })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
