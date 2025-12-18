
"use client";

import { Database } from "@/types/supabase";
import { useState } from "react";

type Image = Database["public"]["Tables"]["listing_images"]["Row"];

export default function ImageGallery({ images }: { images: Image[] }) {
    const [selected, setSelected] = useState(images[0]?.storage_path);

    if (!images || images.length === 0) return <div className="aspect-[4/3] bg-gray-200 rounded flex items-center justify-center">Sin imágenes</div>;

    return (
        <div className="space-y-4">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-100 border">
                <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${selected || images[0].storage_path}`}
                    alt="Main"
                    className="object-contain w-full h-full"
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img) => (
                    <button
                        key={img.id}
                        onClick={() => setSelected(img.storage_path)}
                        className={`w-20 h-20 flex-shrink-0 rounded border-2 overflow-hidden ${selected === img.storage_path ? "border-blue-500" : "border-transparent"
                            }`}
                    >
                        <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listings/${img.storage_path}`}
                            alt="Thumbnail"
                            className="object-cover w-full h-full"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
