import Link from "next/link";

export function HeroSection() {
    return (
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
            <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                alt="City skyline"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-60"
            />
            <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                <div className="mx-auto max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        COMPRA Y VENDE EN <br /> <span className="text-blue-400">ESTEPONA</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        El mercado local de Estepona. Encuentra lo que buscas y vende lo que no usas, cerca de ti.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/publish"
                            className="rounded-md bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all w-full sm:w-auto"
                        >
                            Publicar Anuncio
                        </Link>
                        <Link
                            href="/search"
                            className="rounded-md bg-red-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all w-full sm:w-auto"
                        >
                            Buscar Ahora
                        </Link>
                    </div>
                </div>
            </div>
            {/* Gradient Overlay */}
            <div
                className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-gray-900 sm:h-32"
                aria-hidden="true"
            />
        </div>
    );
}
