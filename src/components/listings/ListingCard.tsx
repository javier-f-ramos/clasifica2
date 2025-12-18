
import Link from "next/link";
import { Database } from "@/types/supabase";

type Listing = Database["public"]["Tables"]["listings"]["Row"] & {
    listing_images: Database["public"]["Tables"]["listing_images"]["Row"][];
    categories: Database["public"]["Tables"]["categories"]["Row"] | null;
};

export default function ListingCard({ listing }: { listing: Listing }) {
    const imageUrl = listing.listing_images?.[0]
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${listing.listing_images[0].storage_path}`
        : null; // Fallback image?

    const isFeatured = listing.featured_until && new Date(listing.featured_until) > new Date();

    return (
        <Link href={`/listings/${listing.id}`} className={`block group rounded-lg overflow-hidden border ${isFeatured ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-gray-200'} hover:shadow-lg transition bg-white`}>
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={listing.title} className="object-cover w-full h-full group-hover:scale-105 transition duration-300" />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">Sin Foto</div>
                )}
                {isFeatured && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                        DESTACADO
                    </span>
                )}
                {listing.is_free && (
                    <span className="absolute bottom-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        GRATIS
                    </span>
                )}
            </div>
            <div className="p-3">
                {/* Category */}
                <p className="text-xs text-gray-500 mb-1">{(listing.categories as any)?.name}</p>

                <h3 className="text-lg font-semibold truncate group-hover:text-blue-600 transition">
                    {listing.title}
                </h3>
                <p className="font-bold text-gray-900 mt-1">
                    {listing.is_free ? "Gratis" : `${listing.price} €`}
                </p>
                <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                    <span>{listing.city}</span>
                    <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
}
