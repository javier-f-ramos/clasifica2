
"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") === "signup" ? "signup" : "login";

    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "signup") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                alert("¡Revisa tu email para confirmar tu cuenta!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/");
                router.refresh();
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            alert(error.message || "Ha ocurrido un error durante la autenticación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow">
            <div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    {mode === "signup" ? "Crea tu cuenta" : "Inicia sesión"}
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                <div className="-space-y-px rounded-md shadow-sm">
                    <div>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {loading
                            ? "Cargando..."
                            : mode === "signup"
                                ? "Registrarse"
                                : "Iniciar sesión"}
                    </button>
                </div>
            </form>
            <div className="text-center">
                <button
                    onClick={() => {
                        const newMode = mode === 'login' ? 'signup' : 'login';
                        router.replace(`/login?mode=${newMode}`);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                    {mode === "signup"
                        ? "¿Ya tienes cuenta? Inicia sesión"
                        : "¿No tienes cuenta? Regístrate"}
                </button>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div>Cargando...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
