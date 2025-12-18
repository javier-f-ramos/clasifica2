
import ListingCard from "@/components/listings/ListingCard";
import { createClient } from "@/lib/supabase/server";

interface SearchProps {
    searchParams: {
        q?: string;
        category?: string;
        province?: string;
        minPrice?: string;
        maxPrice?: string;
    };
}

export default async function SearchPage({ searchParams }: SearchProps) {
    const { q, category, province } = await searchParams; // Await in Next 15
    const supabase = await createClient();

    // Build Query
    let query = supabase
        .from("listings")
        .select("*, listing_images(*), categories(*)")
        .eq("status", "published")
        .order("created_at", { ascending: false });

    if (category) {
        query = query.eq("category_id", category);
    }
    if (province) {
        query = query.ilike("province", `%${province}%`);
    }
    if (q) {
        query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    // Fetch Listings
    const { data: listings } = await query;

    // Fetch Categories for Filter
    const { data: categories } = await supabase.from("categories").select("*").order("name");

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                <div>
                    <h3 className="font-bold mb-3">Categorías</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="/search" className={`block hover:text-blue-600 ${!category ? 'font-bold text-blue-600' : ''}`}>Todas</a>
                        </li>
                        {categories?.map(cat => (
                            <li key={cat.id}>
                                <a href={`/search?category=${cat.id}`} className={`block hover:text-blue-600 ${category === cat.id ? 'font-bold text-blue-600' : ''}`}>
                                    {cat.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Additional Filters could go here (Province, Price) - simple links or client form */}
            </aside>

            {/* Results */}
            <div className="flex-grow">
                <h1 className="text-2xl font-bold mb-6">
                    {q ? `Resultados para "${q}"` : category ? `Anuncios en ${categories?.find(c => c.id === category)?.name}` : "Todos los anuncios"}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings && listings.length > 0 ? (
                        listings.map(l => (
                            <ListingCard key={l.id} listing={l as any} />
                        ))
                    ) : (
                        <p className="text-gray-500">No se encontraron anuncios.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
