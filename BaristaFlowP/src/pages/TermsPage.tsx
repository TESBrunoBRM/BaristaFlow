import React from 'react';

const TermsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold text-[#3A1F18] mb-8 border-b-2 border-amber-500 pb-4">Términos de Servicio</h1>

            <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                    Bienvenido a BaristaFlow. Al acceder y utilizar nuestro sitio web, usted acepta cumplir con los siguientes términos y condiciones. Por favor, léalos atentamente.
                </p>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">1. Uso del Sitio</h2>
                <p className="mb-4">
                    Usted se compromete a utilizar nuestro sitio solo para fines legales y de una manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute del sitio por parte de cualquier tercero.
                </p>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">2. Propiedad Intelectual</h2>
                <p className="mb-4">
                    Todo el contenido de este sitio, incluyendo texto, gráficos, logotipos, imágenes y software, es propiedad de BaristaFlow o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.
                </p>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">3. Productos y Servicios</h2>
                <p className="mb-4">
                    Nos esforzamos por describir nuestros productos y servicios con la mayor precisión posible. Sin embargo, no garantizamos que las descripciones de los productos u otro contenido sean exactos, completos, fiables, actuales o libres de errores.
                </p>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">4. Limitación de Responsabilidad</h2>
                <p className="mb-4">
                    BaristaFlow no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de uso de nuestro sitio o servicios.
                </p>

                <h2 className="text-2xl font-bold text-[#3A1F18] mt-8 mb-4">5. Modificaciones</h2>
                <p className="mb-4">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
                </p>
            </div>
        </div>
    );
};

export default TermsPage;
