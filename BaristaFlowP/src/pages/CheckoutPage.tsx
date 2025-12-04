import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { ref, set } from 'firebase/database';

const CheckoutPage: React.FC = () => {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Simulación de proceso de pago
    const handlePayment = async () => {
        setLoading(true);

        // Simulamos un retraso de red como si estuviéramos contactando a Mercado Pago
        setTimeout(async () => {
            // 🚨 CREAR NOTIFICACIÓN DE PEDIDO 🚨
            if (user) {
                try {
                    const notificationRef = ref(database, `notifications/${user.uid}/${Date.now()}`);
                    await set(notificationRef, {
                        type: 'order_update',
                        message: `¡Tu pedido #${Math.floor(Math.random() * 10000)} ha sido confirmado! Estamos preparándolo.`,
                        read: false,
                        timestamp: Date.now()
                    });
                } catch (error) {
                    console.error("Error creating notification:", error);
                }
            }

            setLoading(false);
            clearCart(); // Limpiamos el carrito
            navigate('/payment-success'); // Redirigimos a éxito
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Tu carrito está vacío</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                >
                    Volver a la tienda
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <h1 className="text-3xl font-extrabold text-[#3A1F18] mb-8 flex items-center">
                <FaLock className="mr-3 text-amber-500" /> Finalizar Compra
            </h1>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Resumen del Pedido (2/3 del ancho) */}
                <div className="md:col-span-2 space-y-6">

                    {/* Lista de Items */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <FaShoppingBag className="mr-2 text-gray-500" /> Resumen del Pedido
                        </h2>
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-700">
                                        ${(parseFloat(item.price.toString().replace(/[^0-9.-]+/g, "")) * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Formulario de Envío (Simulado) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Datos de Envío</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Nombre Completo" className="border p-2 rounded-lg w-full" />
                            <input type="text" placeholder="RUT" className="border p-2 rounded-lg w-full" />
                            <input type="text" placeholder="Dirección" className="border p-2 rounded-lg w-full md:col-span-2" />
                            <input type="text" placeholder="Ciudad" className="border p-2 rounded-lg w-full" />
                            <input type="text" placeholder="Teléfono" className="border p-2 rounded-lg w-full" />
                        </form>
                    </div>

                </div>

                {/* Panel de Pago (1/3 del ancho) */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Total a Pagar</h2>

                        <div className="flex justify-between items-center mb-2 text-gray-600">
                            <span>Subtotal</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-gray-600">
                            <span>Envío</span>
                            <span className="text-green-600 font-semibold">Gratis</span>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-8">
                            <div className="flex justify-between items-center text-2xl font-extrabold text-[#3A1F18]">
                                <span>Total</span>
                                <span>${total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center justify-center ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#009EE3] hover:bg-[#0089C5]' // Color Mercado Pago
                                }`}
                        >
                            {loading ? (
                                <span>Procesando...</span>
                            ) : (
                                <>
                                    <span className="mr-2">Pagar con</span>
                                    <span className="font-extrabold">Mercado Pago</span>
                                </>
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center">
                            <FaLock className="mr-1" /> Pago 100% Seguro y Encriptado
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;
