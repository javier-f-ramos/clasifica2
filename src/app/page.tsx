import ListingCard from "@/components/listings/ListingCard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { ValueProps } from "@/components/home/ValueProps";
import { CategoryGrid } from "@/components/home/CategoryGrid";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const supabase = await createClient();

  // 1. Fetch Premium Listings
  let premiumListings: any[] = [];
  let recentListings: any[] = [];

  try {
    const { data: premium } = await supabase
      .from("listings")
      .select("*, listing_images(*), categories(*)")
      .eq("status", "published")
      .not("premium_until", "is", null)
      .gt("premium_until", new Date().toISOString())
      .order("premium_until", { ascending: false })
      .limit(4);
    premiumListings = premium || [];

    const { data: recent } = await supabase
      .from("listings")
      .select("*, listing_images(*), categories(*)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(8);
    recentListings = recent || [];

  } catch (err) {
    console.warn("Database connection failed, using mock data", err);
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <HeroSection />

      <ValueProps />

      {/* Featured Listings Section */}
      {premiumListings && premiumListings.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Anuncios Destacados
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Las mejores oportunidades seleccionadas para ti.
                </p>
              </div>
              <Link href="/search?premium=true" className="hidden sm:block text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Ver todos <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {premiumListings.map((listing) => (
                <div key={listing.id} className="h-full">
                  <ListingCard listing={listing as any} />
                </div>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/search?premium=true" className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Ver todos <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <CategoryGrid />

      {/* Recent Listings Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Recién Añadido
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Lo último que ha llegado a tu ciudad.
              </p>
            </div>
            <Link href="/search" className="hidden sm:block text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500">
              Ver todo el catálogo <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentListings.map((listing) => (
              <div key={listing.id} className="h-full">
                <ListingCard listing={listing as any} />
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-gray-100 pt-10 text-center">
            <Link
              href="/publish"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              ¿Tienes algo que vender? Publícalo hoy
            </Link>
          </div>
        </div>
      </section>

      {/* CTA / Testimonial Placeholder */}
      <section className="relative isolate overflow-hidden bg-blue-600 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¿Listo para vender?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Únete a miles de personas que ya están vendiendo y comprando en su ciudad.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/publish"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Empezar Ahora
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
