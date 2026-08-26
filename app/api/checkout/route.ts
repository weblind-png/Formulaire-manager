import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { missionId } = await req.json();
  if (!missionId) return NextResponse.json({ error: 'missionId manquant' }, { status: 400 });

  const { data: mission, error } = await supabaseAdmin
    .from('missions')
    .select('id, status, target_function')
    .eq('id', missionId)
    .single();

  if (error || !mission) return NextResponse.json({ error: 'Mission introuvable' }, { status: 404 });
  if (mission.status === 'paid' || mission.status === 'generated') {
    return NextResponse.json({ error: 'Mission déjà payée' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: process.env.PRICE_GUIDELINE!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/mission/${missionId}/guideline?paid=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/mission/${missionId}/summary`,
    // Le lien entre la session Stripe et la mission se fait ici, pas côté front
    metadata: { missionId },
  });

  await supabaseAdmin
    .from('missions')
    .update({ stripe_session_id: session.id })
    .eq('id', missionId);

  return NextResponse.json({ url: session.url });
}
