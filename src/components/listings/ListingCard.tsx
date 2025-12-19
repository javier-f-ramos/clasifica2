import Link from "next/link";
import { Database } from "@/types/supabase";
import { MapPin, Calendar, ExternalLink } from "lucide-react";

type Listing = Database["public"]["Tables"]["listings"]["Row"] & {
    listing_images: Database["public"]["Tables"]["listing_images"]["Row"][];
    categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};

export default function ListingCard({ listing }: { listing: Listing }) {
    const imageUrl = listing.listing_images?.[0]
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${listing.listing_images[0].storage_path}`
        : null;

    const isFeatured = listing.featured_until && new Date(listing.featured_until) > new Date();

    return (
        <div className={`group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border ${isFeatured ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-gray-200'} overflow-hidden h-full`}>
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={listing.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-300 bg-gray-50">
                        <span className="text-xs font-medium">Sin imagen</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {isFeatured && (
                        <span className="bg-yellow-400 text-yellow-950 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Destacado
                        </span>
                    )}
                    {listing.is_free && (
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Gratis
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-5 text-left">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                        {(listing.categories as any)?.name || "Varios"}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                    {listing.title}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {listing.city}
                        </span>
                        <div className="text-xl font-bold text-gray-900 mt-1">
                            {listing.is_free ? "Gratis" : `$${Number(listing.price).toLocaleString()}`}
                        </div>
                    </div>
                    <Link
                        href={`/listings/${listing.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors gap-1 group/btn"
                    >
                        Ver Detalles
                    </Link>
                </div>
            </div>
        </div>
    );
}
