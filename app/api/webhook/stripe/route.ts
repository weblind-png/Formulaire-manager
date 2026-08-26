import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

// Stripe envoie le body brut : ne pas laisser Next.js le parser en JSON
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Signature invalide: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const missionId = session.metadata?.missionId;

    if (missionId) {
      // C'EST ICI, et uniquement ici, que le statut passe à "paid".
      // Jamais depuis le front, jamais depuis la page de succès.
      await supabaseAdmin
        .from('missions')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', missionId);
    }
  }

  return NextResponse.json({ received: true });
}
