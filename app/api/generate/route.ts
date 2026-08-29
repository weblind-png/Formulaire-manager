import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateGuideline } from '@/lib/ai';
import type { Mission } from '@/lib/types';

export async function POST(req: NextRequest) {
  const { missionId } = await req.json();
  if (!missionId) return NextResponse.json({ error: 'missionId manquant' }, { status: 400 });

  const { data: mission, error } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', missionId)
    .single();

  if (error || !mission) return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 });

  // Verrou anti-contournement : la génération n'est possible QUE si le webhook
  // a déjà marqué la mission "paid". Aucun autre chemin ne permet de générer.
  if (mission.status !== 'paid' && mission.status !== 'generated') {
    return NextResponse.json({ error: 'Paiement requis' }, { status: 402 });
  }

  // Déjà généré : on renvoie le résultat existant plutôt que de repayer un appel IA
  if (mission.status === 'generated' && mission.guideline_json) {
    return NextResponse.json(mission.guideline_json);
  }

  const guideline = await generateGuideline(mission as Mission);

  await supabaseAdmin
    .from('missions')
    .update({ status: 'generated', guideline_json: guideline })
    .eq('id', missionId);

  return NextResponse.json(guideline);
}
