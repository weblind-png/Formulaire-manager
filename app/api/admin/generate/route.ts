import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateGuideline } from '@/lib/ai';
import type { Mission } from '@/lib/types';

export async function POST(req: NextRequest) {
  const { missionId, key } = await req.json();

  if (key !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { data: mission, error } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', missionId)
    .single();

  if (error || !mission) return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 });

  const guideline = await generateGuideline(mission as Mission);

  await supabaseAdmin
    .from('missions')
    .update({ guideline_json: guideline })
    .eq('id', missionId);

  return NextResponse.json(guideline);
}
