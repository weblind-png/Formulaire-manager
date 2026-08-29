import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(req: NextRequest) {
  const { missionId, itemKey, checked } = await req.json();
  if (!missionId || !itemKey) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  const { data: mission, error: fetchError } = await supabaseAdmin
    .from('missions')
    .select('progress_json')
    .eq('id', missionId)
    .single();

  if (fetchError || !mission) return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 });

  const updatedProgress = { ...(mission.progress_json ?? {}), [itemKey]: checked };

  const { error } = await supabaseAdmin
    .from('missions')
    .update({ progress_json: updatedProgress })
    .eq('id', missionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ progress: updatedProgress });
}
