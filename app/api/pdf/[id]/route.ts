import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { supabaseAdmin } from '@/lib/supabase';
import { GuidelinePdf } from '@/lib/pdf';
import type { Mission } from '@/lib/types';

// @react-pdf/renderer a besoin de Node.js (pas compatible edge runtime)
export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const adminKey = searchParams.get('key');

  const { data: mission, error } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !mission) {
    return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 });
  }

  const isAdmin = adminKey && adminKey === process.env.ADMIN_SECRET;
  const isPaid = mission.status === 'paid' || mission.status === 'generated';
  if (!isPaid && !isAdmin) {
    return NextResponse.json({ error: 'Paiement requis' }, { status: 402 });
  }

  if (!mission.guideline_json) {
    return NextResponse.json({ error: 'Guideline pas encore générée' }, { status: 400 });
  }

  const buffer = await renderToBuffer(
    GuidelinePdf({ mission: mission as Mission, guideline: mission.guideline_json })
  );

  const filename = `guideline-${mission.target_function}-${mission.id.slice(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
