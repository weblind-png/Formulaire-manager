import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { summarizeCompany } from '@/lib/ai';

// Création d'une mission (étape 1 du formulaire)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { company_url, target_function, mission_description, mission_duration_days } = body;

  if (!company_url || !target_function || !mission_description || !mission_duration_days) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
  }

  // TODO: remplacer par votre étape de scraping réelle (Firecrawl, etc.)
  const rawContent = `Contenu extrait de ${company_url}`;
  const company_summary = await summarizeCompany(company_url, rawContent);

  const { data, error } = await supabaseAdmin
    .from('missions')
    .insert({
      company_url,
      company_summary,
      target_function,
      mission_description,
      mission_duration_days,
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
