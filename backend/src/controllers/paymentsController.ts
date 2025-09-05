import { Request, Response } from 'express';
import Stripe from 'stripe';
import admin from '../config/firebase';

const stripeSecret = process.env.STRIPE_SECRET_KEY as string;
if (!stripeSecret) {
  // Don't crash module load; fail at request time with clear message
  console.warn('STRIPE_SECRET_KEY is not set; payments endpoints will fail until configured.');
}

const stripe = stripeSecret ? new Stripe(stripeSecret) : (null as any);

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    if (!stripe) {
      res.status(500).json({ error: 'Stripe not configured' });
      return;
    }

    const { amount, currency = 'eur' } = req.body as { amount: number; currency?: string };
    if (!amount || amount < 100) {
      res.status(400).json({ error: 'Montant minimum 1€ (100 cents)' });
      return;
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: 'Don Break' },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment/cancel`,
      metadata: {
        // If authenticated, we could include user id/email from req.user
        userId: (req as any).user?.uid || '',
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout session error:', err);
    res.status(500).json({ error: err.message || 'Erreur serveur Stripe' });
  }
};

// Webhook handler: must use express.raw at route level, defined in server.ts before json middleware
export const stripeWebhookHandler = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    if (!webhookSecret) {
      res.status(500).send('Webhook secret not set');
      return;
    }
    if (!stripe) {
      res.status(500).send('Stripe not configured');
      return;
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const db = admin.firestore();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Persist payment record
        await db.collection('payments').doc(session.id).set({
          id: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          status: session.payment_status,
          customer_email: session.customer_details?.email || null,
          userId: session.metadata?.userId || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        break;
      }
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await db.collection('payments').doc(session.id).set({
          id: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          status: 'failed',
          customer_email: session.customer_details?.email || null,
          userId: session.metadata?.userId || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        break;
      }
      default:
        // ignore other events
        break;
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    res.status(500).send('Server error');
  }
};
