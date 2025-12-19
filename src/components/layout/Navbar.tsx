import Link from "next/link";
import Image from "next/image";
import AuthButton from "../auth/AuthButton";
import { PlusCircle, Search } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <Image
                        src="/logo.png"
                        alt="CLASIFICADOS Estepona Info"
                        width={180}
                        height={50}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/search" className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 transition-colors">
                        <Search className="w-4 h-4" /> Explorar
                    </Link>
                    <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        Categorías
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <AuthButton />
                    </div>

                    <Link
                        href="/publish"
                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all gap-2"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Publicar</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
