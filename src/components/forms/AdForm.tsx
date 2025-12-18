
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

interface Category {
    id: string;
    name: string;
}

interface AdFormProps {
    categories: Category[];
    initialData?: any; // For edit mode
}

export default function AdForm({ categories, initialData }: AdFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        category_id: initialData?.category_id || "",
        price: initialData?.price || "",
        is_free: initialData?.is_free || false,
        province: initialData?.province || "",
        city: initialData?.city || "",
        youtube_url: initialData?.youtube_url || "",
        email: "", // User usually wants to auto-fill this
        phone: "",
        terms_accepted: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.terms_accepted) return alert("Debes aceptar los términos.");
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No autenticado");

            // 1. Insert Listing
            const payload = {
                user_id: user.id,
                title: formData.title,
                description: formData.description,
                category_id: formData.category_id,
                price: formData.is_free ? 0 : parseFloat(formData.price as string),
                is_free: formData.is_free,
                province: formData.province,
                city: formData.city,
                youtube_url: formData.youtube_url,
                status: "published", // Or 'paused' initially?
            };

            let listingId = initialData?.id;

            if (listingId) {
                // Update
                const { error } = await supabase.from('listings').update(payload).eq('id', listingId);
                if (error) throw error;
            } else {
                // Create
                const { data, error } = await supabase.from('listings').insert(payload).select().single();
                if (error) throw error;
                listingId = data.id;
            }

            // 2. Insert Images (if any new ones)
            if (uploadedImages.length > 0 && listingId) {
                const imageInserts = uploadedImages.map((path, idx) => ({
                    listing_id: listingId,
                    storage_path: path,
                    sort_order: idx
                }));
                const { error: imgError } = await supabase.from('listing_images').insert(imageInserts);
                if (imgError) console.error("Error saving images", imgError);
            }

            router.push("/dashboard");
            router.refresh();

        } catch (err: any) {
            alert("Error al publicar: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            {/* 1. Detalles */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Detalles del Anuncio</h2>

                <div>
                    <label className="block text-sm font-medium">Título del anuncio *</label>
                    <input name="title" required value={formData.title} onChange={handleChange} className="w-full border rounded p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium">Categoría *</label>
                    <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full border rounded p-2">
                        <option value="">Selecciona una categoría</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Descripción *</label>
                    <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="w-full border rounded p-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Provincia *</label>
                        <input name="province" required value={formData.province} onChange={handleChange} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Ciudad *</label>
                        <input name="city" required value={formData.city} onChange={handleChange} className="w-full border rounded p-2" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium">Precio (€)</label>
                        <input
                            name="price"
                            type="number"
                            disabled={formData.is_free}
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border rounded p-2 disabled:bg-gray-100"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                        <input
                            name="is_free"
                            type="checkbox"
                            checked={formData.is_free}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        <label className="text-sm">Gratuito</label>
                    </div>
                </div>
            </section>

            {/* 2. Multimedia */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Fotos y Vídeo</h2>
                <ImageUploader onUploadComplete={(paths) => setUploadedImages(prev => [...prev, ...paths])} />

                <div>
                    <label className="block text-sm font-medium">Vídeo YouTube (Opcional)</label>
                    <input name="youtube_url" placeholder="https://youtube.com/..." value={formData.youtube_url} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
            </section>

            {/* 3. Contacto */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Datos de contacto</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Email (se ocultará)</label>
                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Teléfono (Opcional)</label>
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input name="terms_accepted" type="checkbox" required checked={formData.terms_accepted} onChange={handleChange} className="h-4 w-4" />
                    <label className="text-sm">Acepto los términos y condiciones</label>
                </div>
            </section>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
                {loading ? "Publicando..." : "Publicar Anuncio"}
            </button>
        </form>
    );
}
