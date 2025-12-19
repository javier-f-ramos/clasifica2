"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import { FileText, Image as ImageIcon, Contact, Loader2, MapPin, Euro, Tag } from "lucide-react";

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
        province: "Málaga",
        city: "Estepona",
        youtube_url: initialData?.youtube_url || "",
        email: "",
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
                province: "Málaga",
                city: "Estepona",
                youtube_url: formData.youtube_url,
                status: "published",
            };

            let listingId = initialData?.id;

            if (listingId) {
                const { error } = await supabase.from('listings').update(payload).eq('id', listingId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('listings').insert(payload).select().single();
                if (error) throw error;
                listingId = data.id;
            }

            // 2. Insert Images
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

    const inputClasses = "block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6";
    const labelClasses = "block text-sm font-medium leading-6 text-gray-900 mb-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
            {/* 1. Detalles */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                    <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Detalles del Anuncio</h2>
                        <p className="text-sm text-gray-500">Describe bien tu producto para vender más rápido</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={labelClasses}>Título del anuncio <span className="text-red-500">*</span></label>
                        <input name="title" required value={formData.title} onChange={handleChange} className={inputClasses} placeholder="Ej: Bicicleta de montaña Trek, iPhone 14 Pro..." />
                    </div>

                    <div>
                        <label className={labelClasses}>Categoría <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select name="category_id" required value={formData.category_id} onChange={handleChange} className={inputClasses}>
                                <option value="">Selecciona una categoría</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Descripción <span className="text-red-500">*</span></label>
                        <textarea name="description" required rows={5} value={formData.description} onChange={handleChange} className={inputClasses} placeholder="Describe el estado, características y motivo de la venta..." />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Precio (€)</label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Euro className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    name="price"
                                    type="number"
                                    disabled={formData.is_free}
                                    value={formData.price}
                                    onChange={handleChange}
                                    className={`${inputClasses} pl-10 disabled:bg-gray-50 disabled:text-gray-400`}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    name="is_free"
                                    type="checkbox"
                                    id="is_free"
                                    checked={formData.is_free}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                />
                                <label htmlFor="is_free" className="text-sm text-gray-600 cursor-pointer select-none">Marcar como Gratuito</label>
                            </div>
                        </div>

                        {/* Location (Fixed to Estepona) */}
                        <div className="hidden">
                            <input name="city" value="Estepona" readOnly />
                            <input name="province" value="Málaga" readOnly />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Multimedia */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                    <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Fotos y Vídeo</h2>
                        <p className="text-sm text-gray-500">Una imagen vale más que mil palabras</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <ImageUploader onUploadComplete={(paths) => setUploadedImages(prev => [...prev, ...paths])} />
                    </div>

                    <div>
                        <label className={labelClasses}>Video de YouTube (Opcional)</label>
                        <input name="youtube_url" placeholder="https://youtube.com/watch?v=..." value={formData.youtube_url} onChange={handleChange} className={inputClasses} />
                        <p className="mt-1 text-xs text-gray-500">Pega el enlace completo de tu vídeo.</p>
                    </div>
                </div>
            </div>

            {/* 3. Contacto & Submit */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                    <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <Contact className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Finalizar</h2>
                        <p className="text-sm text-gray-500">Revisa tus datos de contacto</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className={labelClasses}>Email (Privado) <span className="text-red-500">*</span></label>
                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Teléfono (Opcional)</label>
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputClasses} />
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-8">
                    <input name="terms_accepted" type="checkbox" id="terms" required checked={formData.terms_accepted} onChange={handleChange} className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <label htmlFor="terms" className="text-sm text-blue-900 cursor-pointer select-none">
                        He leído y acepto los <span className="font-semibold underline">términos y condiciones</span> y la política de privacidad. Confirmo que tengo derecho a vender este artículo.
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
                    {loading ? "Publicando..." : "Publicar Anuncio Ahora"}
                </button>
            </div>
        </form>
    );
}
