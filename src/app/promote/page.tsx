
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe"; // Import stripe to check keys? Or just use client-side fetch.

// Pricing configuration
const FEATURED_PRICES = [
    { days: 1, price: 1.00, label: "1 Día" },
    { days: 3, price: 2.40, label: "3 Días" },
    { days: 7, price: 5.20, label: "7 Días" },
    { days: 15, price: 10.50, label: "15 Días" },
    { days: 30, price: 20.00, label: "30 Días" },
];

const PREMIUM_PRICE = { days: 30, price: 50.00, label: "Premium (Home) - 30 Días" };

interface Props {
    searchParams: { id: string };
}

export default async function PromotePage({ searchParams }: Props) {
    const { id } = await searchParams; // Next 15
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: listing } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

    if (!listing || listing.user_id !== user.id) redirect("/dashboard");

    // Server Action for Checkout
    async function createCheckout(formData: FormData) {
        "use server";

        // 1. Auth & Validation
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) redirect("/login");

        const type = formData.get("type") as "featured" | "premium";
        const days = parseInt(formData.get("days") as string);
        const price = parseFloat(formData.get("price") as string);

        // Verify listing ownership again
        const { data: verifiedListing } = await supabase.from("listings").select("*").eq("id", id).single();
        if (!verifiedListing || verifiedListing.user_id !== user.id) {
            redirect("/dashboard");
        }

        try {
            // const Stripe = require('stripe'); // Remove legacy require
            // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

            // Use shared instance imported from @/lib/stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: type === 'premium' ? `Anuncio Premium (${verifiedListing.title})` : `Anuncio Destacado (${verifiedListing.title})`,
                            description: `${days} días de visibilidad ${type}`,
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/promote?id=${id}`,
                metadata: {
                    listing_id: id,
                    user_id: user.id,
                    type: type,
                    days: days.toString()
                }
            });

            if (session.url) {
                redirect(session.url);
            }
        } catch (err) {
            console.error(err);
            // Handle error
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Destacar Anuncio: {listing.title}</h1>

            <div className="grid gap-8">
                {/* Featured */}
                <section className="border p-6 rounded-lg bg-white shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-yellow-600">Opción A: Destacado en Categoría</h2>
                    <p className="text-gray-600 mb-4">Aparece siempre arriba en los listados de su categoría.</p>

                    <div className="space-y-3">
                        {FEATURED_PRICES.map((plan) => (
                            <form key={plan.days} action={createCheckout} className="flex justify-between items-center border-b pb-2 last:border-0">
                                <input type="hidden" name="type" value="featured" />
                                <input type="hidden" name="days" value={plan.days} />
                                <input type="hidden" name="price" value={plan.price} />
                                <div>
                                    <span className="font-bold">{plan.label}</span>
                                </div>
                                <button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-4 py-2 rounded text-sm">
                                    Pagar {plan.price.toFixed(2)}€
                                </button>
                            </form>
                        ))}
                    </div>
                </section>

                {/* Premium */}
                <section className="border p-6 rounded-lg bg-white shadow-sm border-purple-100 bg-purple-50">
                    <h2 className="text-xl font-bold mb-4 text-purple-700">Opción B: Destacado Premium (Home)</h2>
                    <p className="text-gray-600 mb-4">Aparece en la página de inicio, máxima visibilidad.</p>

                    <form action={createCheckout} className="flex justify-between items-center">
                        <input type="hidden" name="type" value="premium" />
                        <input type="hidden" name="days" value={PREMIUM_PRICE.days} />
                        <input type="hidden" name="price" value={PREMIUM_PRICE.price} />
                        <div>
                            <span className="font-bold text-lg">{PREMIUM_PRICE.label}</span>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded">
                            Pagar {PREMIUM_PRICE.price.toFixed(2)}€
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
