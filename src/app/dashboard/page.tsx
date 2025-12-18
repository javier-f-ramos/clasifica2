
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Database } from "@/types/supabase";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: listings } = await supabase
        .from("listings")
        .select("*, listing_images(*), categories(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const activeCount =
        listings?.filter((l) => l.status === "published").length || 0;
    const isLimitReached = activeCount >= 10;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Mis Anuncios</h1>
                    <p className="text-gray-600">
                        Gestiona tus publicaciones. Activos: {activeCount}/10
                    </p>
                </div>
                {isLimitReached ? (
                    <div className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed">
                        Límite Alcanzado
                    </div>
                ) : (
                    <Link
                        href="/publish"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Crear Anuncio
                    </Link>
                )}
            </div>

            <div className="grid gap-4">
                {listings && listings.length > 0 ? (
                    listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="border p-4 rounded-lg bg-white shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center"
                        >
                            <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                                {/* Placeholder for image */}
                                {(listing as any).listing_images?.[0] ? (
                                    <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${(listing as any).listing_images[0].storage_path}`} className="object-cover w-full h-full" alt={listing.title} />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">Sin Foto</div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between">
                                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${listing.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {listing.status === 'published' ? 'Activo' : listing.status === 'paused' ? 'Pausado' : 'Eliminado'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{(listing as any).categories?.name} • {listing.city}</p>
                                <p className="font-bold text-gray-900 mt-1">
                                    {listing.is_free ? "GRATIS" : `$${listing.price}`}
                                </p>
                                {/* Expiration or features */}
                                {listing.featured_until && new Date(listing.featured_until) > new Date() && (
                                    <span className="text-xs text-yellow-600 font-bold mr-2">⭐ Destacado</span>
                                )}
                                {listing.premium_until && new Date(listing.premium_until) > new Date() && (
                                    <span className="text-xs text-purple-600 font-bold">💎 Premium</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/publish?id=${listing.id}`} className="px-3 py-1 border rounded text-sm hover:bg-gray-50">Editar</Link>
                                {listing.status === 'published' ? (
                                    <form action={async () => {
                                        'use server';
                                        const sb = await createClient();
                                        await sb.from('listings').update({ status: 'paused' }).eq('id', listing.id);
                                        redirect('/dashboard');
                                    }}>
                                        <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50">Pausar</button>
                                    </form>
                                ) : (
                                    <form action={async () => {
                                        'use server';
                                        const sb = await createClient();
                                        // Check limit again strictly speaking, but trigger will handle it
                                        await sb.from('listings').update({ status: 'published' }).eq('id', listing.id);
                                        redirect('/dashboard');
                                    }}>
                                        <button disabled={isLimitReached} className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50">Activar</button>
                                    </form>
                                )}
                                <Link href={`/promote?id=${listing.id}`} className="px-3 py-1 border border-yellow-400 text-yellow-700 rounded text-sm hover:bg-yellow-50">Destacar</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        No tienes anuncios publicados aún.
                    </div>
                )}
            </div>
        </div>
    );
}
