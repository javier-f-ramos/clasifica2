
import AdForm from "@/components/forms/AdForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PublishPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/publish");
    }

    // Fetch categories
    const { data: categories } = await supabase
        .from("categories")
        .select("id, name")
        .order("sort_order");

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Publicar Anuncio</h1>
                <p className="text-gray-600">Completa los detalles de tu anuncio</p>
            </div>
            <AdForm categories={categories || []} />
        </div>
    );
}
