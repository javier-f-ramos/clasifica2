import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardListingCard from "@/components/dashboard/DashboardListingCard";
import { PlusCircle, LayoutDashboard } from "lucide-react";

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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <LayoutDashboard className="w-8 h-8 text-blue-600" />
                            Mis Anuncios
                        </h1>
                        <p className="mt-1 text-gray-500">
                            Administra tus ventas y promociones desde aquí.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-right mr-2 my-1">
                            <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider">Anuncios Activos</span>
                            <span className={`text-xl font-bold ${isLimitReached ? 'text-red-600' : 'text-gray-900'}`}>{activeCount}<span className="text-gray-400 text-sm">/10</span></span>
                        </div>
                        {isLimitReached ? (
                            <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-medium text-sm">
                                Límite Alcanzado
                            </button>
                        ) : (
                            <Link
                                href="/publish"
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-semibold text-sm"
                            >
                                <PlusCircle className="w-4 h-4" /> Crear Anuncio
                            </Link>
                        )}
                    </div>
                </div>

                {/* Listings Grid */}
                <div className="space-y-4">
                    {listings && listings.length > 0 ? (
                        listings.map((listing) => (
                            <DashboardListingCard key={listing.id} listing={listing} isLimitReached={isLimitReached} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <PlusCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No tienes anuncios aún</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">Empecemos a vender. Es gratis y solo toma unos minutos.</p>
                            <Link href="/publish" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
                                Publicar mi primer anuncio
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
