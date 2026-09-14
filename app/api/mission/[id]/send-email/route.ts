import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { supabaseAdmin } from '@/lib/supabase';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { GuidelinePdf } from '@/lib/pdf';
import type { Mission } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: 'Email manquant' }, { status: 400 });
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Envoi d'email non configuré" }, { status: 500 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { data: mission, error } = await supabaseAdmin
    .from('missions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !mission) return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 });
  if (!mission.guideline_json) return NextResponse.json({ error: 'Guideline pas encore générée' }, { status: 400 });

  const buffer = await renderToBuffer(
    GuidelinePdf({ mission: mission as Mission, guideline: mission.guideline_json })
  );
  const filename = `guideline-${mission.target_function}-${mission.id.slice(0, 8)}.pdf`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'guideline@iteriumpartners.com',
      to: email,
      subject: `Votre guideline de mission — ${mission.company_name || mission.company_url}`,
      html: `<p>Bonjour,</p><p>Voici votre guideline de mission au format PDF, en pièce jointe.</p><p>ITERIUM PARTNERS</p>`,
      attachments: [
        {
          filename,
          content: buffer.toString('base64'),
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Erreur Resend', text);
    return NextResponse.json({ error: "Échec de l'envoi" }, { status: 500 });
  }

  return NextResponse.json({ sent: true });
}
