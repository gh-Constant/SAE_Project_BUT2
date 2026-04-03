import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();
const stripeParams = { apiVersion: "2024-12-18.acacia" as any };
// on récupère la clé Stripe depuis le .env, plus de clé par défaut en dur
// si la variable manque, le serveur plante au démarrage plutôt que de fonctionner avec une fausse clé
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY non défini — les paiements ne fonctionneront pas');
}
const stripe = new Stripe(STRIPE_KEY || '', stripeParams);
const GOLD_PACKAGES = new Map([
  [100, 100],
  [500, 500],
  [1500, 1500],
]);
const MIN_CUSTOM_GOLD = 100;
const MAX_CUSTOM_GOLD = 100000;

const getExpectedPriceInCents = (amountGold: number): number | null => {
  if (!Number.isInteger(amountGold)) return null;

  const packagePrice = GOLD_PACKAGES.get(amountGold);
  if (packagePrice) return packagePrice;

  if (amountGold < MIN_CUSTOM_GOLD || amountGold > MAX_CUSTOM_GOLD) return null;

  return amountGold;
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    const { amountGold, priceInCents } = req.body;

    if (!authenticatedUserId || !amountGold || !priceInCents) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const normalizedAmountGold = Number(amountGold);
    const normalizedPriceInCents = Number(priceInCents);
    const expectedPrice = getExpectedPriceInCents(normalizedAmountGold);

    if (!expectedPrice || expectedPrice !== normalizedPriceInCents) {
      return res.status(400).json({ error: 'Invalid gold amount or price' });
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
        userId: authenticatedUserId.toString(),
        amountGold: normalizedAmountGold.toString(),
        priceInCents: normalizedPriceInCents.toString(),
      },
      client_reference_id: authenticatedUserId.toString(),
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
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    const { sessionId } = req.body;

    if (!authenticatedUserId || !sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // In a production app, use webhooks instead of an endpoint called by the client.
    // However, since this is a mock/hybrid scenario, we'll verify the session here.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const userId = Number(session.metadata?.userId);
      const amountGold = Number(session.metadata?.amountGold);

      if (isNaN(userId) || isNaN(amountGold) || userId !== authenticatedUserId) {
        return res.status(400).json({ error: 'Invalid session metadata' });
      }

      const expectedPrice = getExpectedPriceInCents(amountGold);
      const priceInCentsFromSession = Number(session.metadata?.priceInCents);
      if (
        !expectedPrice
        || isNaN(priceInCentsFromSession)
        || priceInCentsFromSession !== expectedPrice
        || session.amount_total !== expectedPrice
      ) {
        return res.status(400).json({ error: 'Invalid checkout session amount' });
      }
      
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
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;
    const userId = Number(req.params.userId);

    if (!authenticatedUserId || isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (authenticatedUserId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
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
