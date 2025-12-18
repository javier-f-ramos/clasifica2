"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AuthButton.module.css"; // We'll create this or use inline styles for simple buttons

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    if (!user) {
        return (
            <div className="flex gap-4">
                <Link href="/login" className="text-sm font-medium hover:underline">
                    Inicia Sesión
                </Link>
                <Link href="/login?mode=signup" className="text-sm font-medium hover:underline">
                    Regístrate
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
                Mis Anuncios
            </Link>
            <button onClick={handleSignOut} className="text-sm text-red-500 hover:text-red-700">
                Salir
            </button>
        </div>
    );
}
