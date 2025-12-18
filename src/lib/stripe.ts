
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_build';

export const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-12-18.acacia' as any, // Use latest or type safely
    typescript: true,
});
