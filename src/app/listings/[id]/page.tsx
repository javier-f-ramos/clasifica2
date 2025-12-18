
import ImageGallery from "@/components/listings/ImageGallery";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface Props {
    params: { id: string }; // For Next 15 may need `await params`? In 14 it's direct. Next 15 `params` is async.
}

export default async function ListingPage({ params }: Props) {
    // Await params in Next.js 15
    const { id } = await params;

    const supabase = await createClient();

    const { data: listing } = await supabase
        .from("listings")
        .select("*, listing_images(*), categories(*)")
        .eq("id", id)
        .single();

    if (!listing) return notFound();

    // Increment view count could go here (if requested)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Gallery */}
                <div>
                    <ImageGallery images={(listing as any).listing_images} />
                </div>

                {/* Right: Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                        <p className="text-2xl font-bold text-blue-600">
                            {listing.is_free ? "GRATIS" : `${listing.price} €`}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            Publicado el {new Date(listing.created_at).toLocaleDateString()} en {(listing.categories as any).name}
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2">Ubicación</h3>
                        <p>{listing.city}, {listing.province}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Descripción</h3>
                        <p className="whitespace-pre-wrap text-gray-700">{listing.description}</p>
                    </div>

                    {listing.youtube_url && (
                        <div>
                            <h3 className="font-semibold mb-2">Vídeo</h3>
                            <a href={listing.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                Ver en YouTube
                            </a>
                        </div>
                    )}

                    <div className="border-t pt-6">
                        <h3 className="font-bold text-lg mb-4">Contactar al anunciante</h3>
                        <div className="bg-blue-50 p-4 rounded border border-blue-100">
                            <p className="text-sm text-blue-800 mb-2">
                                Si te interesa este anuncio, envía un mensaje.
                            </p>
                            {/* Contact form placeholder */}
                            <form className="space-y-2">
                                <input type="text" placeholder="Tu nombre" className="w-full border p-2 rounded" />
                                <input type="email" placeholder="Tu email" className="w-full border p-2 rounded" />
                                <textarea placeholder="Hola, estoy interesado en..." className="w-full border p-2 rounded" rows={3}></textarea>
                                <button type="button" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
                                    Enviar Mensaje
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    (Funcionalidad simulada para MVP)
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
