"use client";

import Link from "next/link";
import { MoreVertical, PauseCircle, PlayCircle, Eye, Trash2, Edit } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type DashboardListingCardProps = {
    listing: any;
    isLimitReached: boolean;
};

export default function DashboardListingCard({ listing, isLimitReached }: DashboardListingCardProps) {
    const imageUrl = listing.listing_images?.[0]
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${listing.listing_images[0].storage_path}`
        : null;

    const handleToggleStatus = async () => {
        const sb = createClient();
        const newStatus = listing.status === 'published' ? 'paused' : 'published';

        // Optimistic update handled by page refresh usually, but here we trigger logic
        // In a real app we'd use useTransition or SWR mutation
        // For now, doing a simple request then reloading

        if (newStatus === 'published' && isLimitReached) {
            alert("Has alcanzado el límite de anuncios activos.");
            return;
        }

        await sb.from('listings').update({ status: newStatus }).eq('id', listing.id);
        window.location.reload(); // Simple refresh for now
    };

    return (
        <div className="bg-white border text-left border-gray-100 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                {imageUrl ? (
                    <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">
                        Sin imagen
                    </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${listing.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                    {listing.status === 'published' ? 'Activo' : 'Pausado'}
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow space-y-2 w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg truncate pr-4">{listing.title}</h3>
                        <p className="text-gray-500 text-sm">
                            {listing.categories?.name} • {new Date(listing.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    {listing.price && (
                        <span className="font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-full text-sm">
                            {listing.is_free ? "Gratis" : `${listing.price} €`}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                    {/* Actions */}
                    <Link
                        href={`/publish?id=${listing.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                        <Edit className="w-3.5 h-3.5" /> Editar
                    </Link>

                    <button
                        onClick={handleToggleStatus}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded border transition-colors ${listing.status === 'published' ? 'text-yellow-700 border-yellow-200 bg-yellow-50 hover:bg-yellow-100' : 'text-green-700 border-green-200 bg-green-50 hover:bg-green-100'}`}
                    >
                        {listing.status === 'published' ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                        {listing.status === 'published' ? 'Pausar' : 'Activar'}
                    </button>

                    <Link
                        href={`/listings/${listing.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" /> Ver
                    </Link>
                </div>
            </div>

            <Link
                href={`/promote?id=${listing.id}`}
                className="hidden sm:flex flex-shrink-0 flex-col items-center justify-center gap-1 px-4 py-8 border-l border-dashed border-gray-200 text-yellow-600 hover:bg-yellow-50 transition-colors rounded-r-xl"
            >
                <span className="text-xl">⭐</span>
                <span className="text-xs font-bold uppercase">Destacar</span>
            </Link>
        </div>
    );
}
