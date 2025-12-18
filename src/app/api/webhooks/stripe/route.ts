
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js"; // Use Admin client

// Remove top-level import/instantiation to prevent build-time crash
// import { stripe } from "@/lib/stripe"; 

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature")!;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        // Instantiate Stripe here dynamically
        const Stripe = require('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
            apiVersion: '2024-12-18.acacia'
        });

        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for updates bypassing RLS policies (if restrictive) or acting as system
    );

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const { listing_id, type, days, user_id } = session.metadata!;

        // Log payment
        await supabase.from("payments_log").insert({
            user_id,
            listing_id,
            type,
            amount: session.amount_total! / 100,
            days: parseInt(days),
            stripe_checkout_session_id: session.id,
            status: "succeeded"
        });

        // Update Listing
        // Calculate new date
        const { data: listing } = await supabase.from("listings").select("*").eq("id", listing_id).single();

        if (listing) {
            const now = new Date();
            const daysInt = parseInt(days);

            let newUntil: Date;

            if (type === 'featured') {
                const current = listing.featured_until ? new Date(listing.featured_until) : now;
                const base = current > now ? current : now;
                base.setDate(base.getDate() + daysInt);
                newUntil = base;
                await supabase.from("listings").update({ featured_until: newUntil.toISOString() }).eq("id", listing_id);
            } else if (type === 'premium') {
                const current = listing.premium_until ? new Date(listing.premium_until) : now;
                const base = current > now ? current : now;
                base.setDate(base.getDate() + daysInt);
                newUntil = base;
                await supabase.from("listings").update({ premium_until: newUntil.toISOString() }).eq("id", listing_id);
            }
        }
    }

    return NextResponse.json({ received: true });
}
