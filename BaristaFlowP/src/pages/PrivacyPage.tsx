import React from 'react';

const PrivacyPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold text-[#3A1F18] mb-8 border-b-2 border-amber-500 pb-4">Política de Privacidad</h1>

            <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                    En <strong>BaristaFlow</strong>, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos su información personal cuando visita nuestro sitio web y utiliza nuestros servicios.
                </p>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">1. Información que Recopilamos</h2>
                <p className="mb-4">
                    Podemos recopilar información personal que usted nos proporciona voluntariamente, como su nombre, dirección de correo electrónico, dirección de envío y detalles de pago cuando se registra, realiza una compra o se suscribe a nuestro boletín.
                </p>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">2. Uso de la Información</h2>
                <p className="mb-4">
                    Utilizamos su información para:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Procesar y completar sus pedidos.</li>
                    <li>Mejorar su experiencia de compra y personalizar nuestro servicio.</li>
                    <li>Enviarle actualizaciones sobre su pedido y comunicaciones de marketing (si ha optado por recibirlas).</li>
                    <li>Mejorar nuestro sitio web y servicios.</li>
                </ul>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">3. Protección de Datos</h2>
                <p className="mb-4">
                    Implementamos medidas de seguridad robustas para proteger su información personal contra el acceso no autorizado, la alteración, la divulgación o la destrucción.
                </p>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">4. Cookies</h2>
                <p className="mb-4">
                    Utilizamos cookies para mejorar la funcionalidad de nuestro sitio y entender cómo interactúan los usuarios con él. Puede gestionar sus preferencias de cookies a través de la configuración de su navegador.
                </p>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">5. Contacto</h2>
                <p className="mb-4">
                    Si tiene preguntas sobre esta política, contáctenos en <a href="mailto:privacidad@baristaflow.cl" className="text-amber-600 hover:underline">privacidad@baristaflow.cl</a>.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPage;
