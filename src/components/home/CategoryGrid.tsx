import { Car, Home, Briefcase, Wrench, Smartphone, Armchair, Shirt, Dog, Bike, Gamepad2, Music, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const categories = [
    { name: 'Inmobiliaria', icon: Home, href: '/search?category=real-estate' },
    { name: 'Vehículos', icon: Car, href: '/search?category=vehicles' },
    { name: 'Empleo', icon: Briefcase, href: '/search?category=jobs' },
    { name: 'Servicios', icon: Wrench, href: '/search?category=services' },
    { name: 'Electrónica', icon: Smartphone, href: '/search?category=electronics' },
    { name: 'Hogar', icon: Armchair, href: '/search?category=home' },
    { name: 'Moda', icon: Shirt, href: '/search?category=fashion' },
    { name: 'Mascotas', icon: Dog, href: '/search?category=pets' },
    { name: 'Deportes', icon: Bike, href: '/search?category=sports' },
    { name: 'Juegos', icon: Gamepad2, href: '/search?category=gaming' },
    { name: 'Música', icon: Music, href: '/search?category=music' },
    { name: 'Otros', icon: MoreHorizontal, href: '/search?category=others' },
];

export function CategoryGrid() {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Explora por Categoría</h2>
                    <p className="mt-2 text-gray-600">Encuentra exactamente lo que buscas</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow hover:bg-blue-50 group border border-gray-100"
                        >
                            <category.icon className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
