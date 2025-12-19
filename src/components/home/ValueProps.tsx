import { Handshake, Rocket, ShieldCheck } from "lucide-react";

const features = [
    {
        name: 'Fácil de Usar',
        description: 'Diseño intuitivo para que publiques y encuentres lo que buscas en segundos.',
        icon: Handshake,
    },
    {
        name: 'Conecta en Estepona',
        description: 'Habla directamente con vecinos de tu ciudad sin intermediarios.',
        icon: Rocket,
    },
    {
        name: 'Anuncios Seguros',
        description: 'Moderamos el contenido para asegurar una comunidad confiable.',
        icon: ShieldCheck,
    },
];

export function ValueProps() {
    return (
        <div className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        El Mercado de Estepona, Simplificado
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        La mejor comunidad para comprar y vender artículos de segunda mano y conectar con vecinos de Estepona.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col items-center text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                                    <feature.icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                                </div>
                                <dt className="text-xl font-semibold leading-7 text-gray-900">
                                    {feature.name}
                                </dt>
                                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
