import React from 'react';
import { FaTruck, FaUndo, FaBoxOpen } from 'react-icons/fa';

const ReturnsPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold text-[#3A1F18] mb-12 text-center">Envíos y Devoluciones</h1>

            <div className="grid md:grid-cols-2 gap-12">

                {/* Envíos */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-amber-500">
                    <div className="flex items-center mb-6">
                        <FaTruck className="text-3xl text-amber-600 mr-4" />
                        <h2 className="text-2xl font-bold text-gray-800">Política de Envíos</h2>
                    </div>
                    <div className="space-y-4 text-gray-600">
                        <p>
                            <strong>Tiempos de Procesamiento:</strong> Todos los pedidos se procesan dentro de 1-2 días hábiles.
                        </p>
                        <p>
                            <strong>Envíos Nacionales:</strong> Ofrecemos envío estándar (3-5 días hábiles) y exprés (1-2 días hábiles) a todo Chile.
                        </p>
                        <p>
                            <strong>Costos:</strong> El envío es gratuito para compras superiores a $50.000 CLP. Para pedidos menores, el costo se calcula al finalizar la compra.
                        </p>
                        <p>
                            <strong>Seguimiento:</strong> Recibirá un correo electrónico con el número de seguimiento una vez que su pedido haya sido despachado.
                        </p>
                    </div>
                </div>

                {/* Devoluciones */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#3A1F18]">
                    <div className="flex items-center mb-6">
                        <FaUndo className="text-3xl text-[#3A1F18] mr-4" />
                        <h2 className="text-2xl font-bold text-gray-800">Devoluciones y Cambios</h2>
                    </div>
                    <div className="space-y-4 text-gray-600">
                        <p>
                            <strong>Satisfacción Garantizada:</strong> Si no está satisfecho con su compra, aceptamos devoluciones dentro de los 30 días posteriores a la recepción.
                        </p>
                        <p>
                            <strong>Condiciones:</strong> Los artículos deben estar sin usar, en su embalaje original y en las mismas condiciones en que los recibió. El café en grano no se puede devolver si el paquete ha sido abierto, por razones de seguridad alimentaria.
                        </p>
                        <p>
                            <strong>Proceso:</strong> Para iniciar una devolución, contáctenos en soporte@baristaflow.cl con su número de pedido.
                        </p>
                        <p>
                            <strong>Reembolsos:</strong> Una vez recibida e inspeccionada su devolución, procesaremos su reembolso al método de pago original en un plazo de 5-7 días hábiles.
                        </p>
                    </div>
                </div>

            </div>

            <div className="mt-12 bg-amber-50 p-6 rounded-xl flex items-start">
                <FaBoxOpen className="text-4xl text-amber-600 mr-4 shrink-0 mt-1" />
                <div>
                    <h3 className="text-xl font-bold text-[#3A1F18] mb-2">¿Problemas con su pedido?</h3>
                    <p className="text-gray-700">
                        Si su pedido llegó dañado o incorrecto, por favor contáctenos inmediatamente. Nos aseguraremos de resolver el problema enviándole un reemplazo o emitiendo un reembolso completo sin costo adicional para usted.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPage;
