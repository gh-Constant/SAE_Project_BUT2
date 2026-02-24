import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripeParams = { apiVersion: "2024-12-18.acacia" as any };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', stripeParams);

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { userId, amountGold, priceInCents } = req.body;

    if (!userId || !amountGold || !priceInCents) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // In a real app, you would pass `client_reference_id` or `metadata` to fulfill the order via Webhooks.
    // For this example, we will just return a URL.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${amountGold} Gold`,
              description: 'Currency for in-game purchases',
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
        amountGold: amountGold.toString(),
      },
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/client/gold-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/client/gold-cancel`,
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const fulfillPurchase = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // In a production app, use webhooks instead of an endpoint called by the client.
    // However, since this is a mock/hybrid scenario, we'll verify the session here.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const userId = Number(session.metadata?.userId);
      const amountGold = Number(session.metadata?.amountGold);

      if (isNaN(userId) || isNaN(amountGold)) {
        return res.status(400).json({ error: 'Invalid session metadata' });
      }

      // We might want to protect against fulfilling the same session twice,
      // but keeping it simple for now.
      
      const updatedUser = await prisma.user.update({
        where: { id_user: userId },
        data: { gold: { increment: amountGold } },
        select: { id_user: true, gold: true }
      });

      return res.status(200).json({ success: true, user: updatedUser });
    }

    return res.status(400).json({ error: 'Payment not successful yet' });
  } catch (error) {
    console.error('Error fulfilling purchase:', error);
    return res.status(500).json({ error: 'Failed to fulfill purchase' });
  }
};

export const getBalance = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id_user: userId },
      select: { gold: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ gold: user.gold });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return res.status(500).json({ error: 'Failed to fetch balance' });
  }
};
