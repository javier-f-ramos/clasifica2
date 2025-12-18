
import ListingCard from "@/components/listings/ListingCard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const supabase = await createClient();

  // 1. Fetch Premium Listings (visible in Home)
  // 1. Fetch Premium Listings (visible in Home)
  let premiumListings: any[] = [];
  let recentListings: any[] = [];
  let categories: any[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project")) {
      throw new Error("Placeholder Env Vars detection");
    }
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

    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    categories = cats || [];
  } catch (err) {
    console.warn("Database connection failed, using mock data for preview", err);
    // Mock Data for Preview if DB fails
    categories = [
      { id: '1', name: 'Inmobiliaria', slug: 'inmobiliaria' },
      { id: '2', name: 'Motor', slug: 'motor' },
      { id: '3', name: 'Tecnología', slug: 'tecnologia' },
      { id: '4', name: 'Hogar', slug: 'hogar' },
      { id: '5', name: 'Empleo', slug: 'empleo' },
    ];
    const mockListing = {
      id: '1', title: 'Apartamento Centro', price: 250000, city: 'Madrid', province: 'Madrid',
      created_at: new Date().toISOString(), status: 'published', is_free: false,
      listing_images: [], categories: { name: 'Inmobiliaria' }
    };
    premiumListings = [mockListing, mockListing, mockListing, mockListing] as any;
    recentListings = [mockListing, mockListing, mockListing, mockListing] as any;
  }

  // Search Action
  async function searchAction(formData: FormData) {
    "use server";
    const query = formData.get("q");
    redirect(`/search?q=${query}`);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Conecta, vende y descubre tu ciudad.
        </h1>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Tu mercado local simplificado. Publica gratis y destaca tus anuncios.
        </p>

        <form action={searchAction} className="max-w-md mx-auto flex gap-2">
          <input
            name="q"
            type="text"
            placeholder="¿Qué estás buscando?"
            className="flex-grow px-4 py-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded font-bold transition">
            Buscar
          </button>
        </form>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Explora por Categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.id}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-center flex flex-col items-center gap-3 border hover:border-blue-500"
            >
              {/* Icon placeholder */}
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                {cat.name.charAt(0)}
              </div>
              <span className="font-medium text-gray-800">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium Listings */}
      {premiumListings && premiumListings.length > 0 && (
        <section className="bg-white py-12 border-y">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-yellow-500">⭐</span> Anuncios Destacados
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {premiumListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Listings */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recién Añadido</h2>
          <Link href="/search" className="text-blue-600 hover:underline">Ver todo &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recentListings?.map((listing) => (
            <ListingCard key={listing.id} listing={listing as any} />
          ))}
        </div>
      </section>

    </div>
  );
}
