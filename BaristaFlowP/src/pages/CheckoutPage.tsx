import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaTruck, FaCreditCard, FaUser, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { ref, set } from 'firebase/database';

const CheckoutPage: React.FC = () => {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        rut: '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        region: ''
    });

    const steps = [
        { id: 1, label: 'Tus Datos', icon: FaUser },
        { id: 2, label: 'Entrega', icon: FaTruck },
        { id: 3, label: 'Pago', icon: FaCreditCard },
        { id: 4, label: 'Confirmación', icon: FaCheckCircle }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handlePayment = async () => {
        setLoading(true);
        const orderId = `ORD-${Date.now()}`;

        // Simula proceso de pago
        setTimeout(async () => {
            if (user) {
                try {
                    // Guardar Orden en Firebase
                    const orderRef = ref(database, `orders/${user.uid}/${orderId}`);
                    const orderData = {
                        ...formData,
                        items: cart,
                        total,
                        status: 'Completado',
                        date: new Date().toISOString(),
                        paymentMethod: 'Mercado Pago'
                    };
                    await set(orderRef, orderData);

                    // Notificación en DB
                    const notificationRef = ref(database, `notifications/${user.uid}/${Date.now()}`);
                    await set(notificationRef, {
                        type: 'order_success',
                        message: `¡Tu pedido #${orderId} ha sido confirmado!`,
                        read: false,
                        timestamp: Date.now()
                    });

                    // 🚨 ENVIAR CORREO VIA BACKEND 🚨
                    // Llamamos a nuestra API para que envíe el correo
                    try {
                        const { API_BASE_URL } = await import('../config/api'); // Import dinámico para asegurar
                        await fetch(`${API_BASE_URL}/api/orders`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userId: user.uid,
                                orderId,
                                orderData
                            })
                        });
                    } catch (emailError) {
                        console.error("Error triggering email:", emailError);
                        // No bloqueamos el flujo si falla el correo, pero lo logueamos
                    }
                } catch (error) {
                    console.error("Error creating order/notification:", error);
                }
            }

            setLoading(false);
            clearCart();
            setCurrentStep(4); // Ir a confirmación final
        }, 2000);
    };

    if (cart.length === 0 && currentStep !== 4) {
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
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header Steps */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="container mx-auto px-4 py-6 max-w-5xl">
                    <div className="flex justify-between items-center relative">
                        {/* Progress Bar Background */}
                        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 hidden md:block"></div>
                        {/* Progress Bar Fill */}
                        <div
                            className="absolute left-0 top-1/2 h-1 bg-amber-500 -z-10 transition-all duration-300 hidden md:block"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center bg-white px-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive || isCompleted ? 'border-amber-500 bg-amber-500 text-white' : 'border-gray-300 text-gray-400'
                                        }`}>
                                        <Icon className="text-sm" />
                                    </div>
                                    <span className={`text-xs mt-2 font-semibold ${isActive ? 'text-amber-600' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="md:col-span-2">

                        {currentStep === 1 && (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <FaUser className="mr-2 text-amber-500" /> Tus Datos Personales
                                </h2>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="fullName" placeholder="Nombre Completo" onChange={handleInputChange} value={formData.fullName} className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-amber-500 outline-none" />
                                    <input type="text" name="rut" placeholder="RUT" onChange={handleInputChange} value={formData.rut} className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-amber-500 outline-none" />
                                    <input type="email" name="email" placeholder="Email" onChange={handleInputChange} value={formData.email} className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-amber-500 outline-none" />
                                    <input type="tel" name="phone" placeholder="Teléfono" onChange={handleInputChange} value={formData.phone} className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-amber-500 outline-none" />
                                </form>
                                <div className="mt-8 flex justify-end">
                                    <button onClick={nextStep} className="bg-[#3A1F18] text-white px-8 py-3 rounded-lg font-bold hover:bg-amber-900 transition-colors flex items-center">
                                        Continuar <FaChevronRight className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <FaTruck className="mr-2 text-amber-500" /> Datos de Envío
                                </h2>
                                <form className="space-y-4">
                                    <input type="text" name="address" placeholder="Dirección (Calle, Número, Depto)" onChange={handleInputChange} value={formData.address} className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-amber-500 outline-none" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="city" placeholder="Ciudad" onChange={handleInputChange} value={formData.city} className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-amber-500 outline-none" />
                                        <input type="text" name="region" placeholder="Región" onChange={handleInputChange} value={formData.region} className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                </form>
                                <div className="mt-8 flex justify-between">
                                    <button onClick={prevStep} className="text-gray-500 hover:text-gray-700 font-semibold px-4">Volver</button>
                                    <button onClick={nextStep} className="bg-[#3A1F18] text-white px-8 py-3 rounded-lg font-bold hover:bg-amber-900 transition-colors flex items-center">
                                        Ir al Pago <FaChevronRight className="ml-2" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <FaCreditCard className="mr-2 text-amber-500" /> Selecciona Medio de Pago
                                </h2>

                                <div className="space-y-4">
                                    <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all border-amber-500 bg-amber-50">
                                        <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-amber-600 focus:ring-amber-500" />
                                        <div className="ml-4 flex-1">
                                            <span className="block font-bold text-gray-800">Mercado Pago</span>
                                            <span className="block text-sm text-gray-500">Tarjetas de crédito, débito, y efectivo.</span>
                                        </div>
                                        <img src="https://logotipoz.com/wp-content/uploads/2021/10/version-horizontal-large-logo-mercado-pago.webp" alt="Mercado Pago" className="h-8" />
                                    </label>

                                    {/* Other fake options */}
                                    <label className="flex items-center p-4 border rounded-xl cursor-not-allowed opacity-50">
                                        <input type="radio" name="payment" disabled className="w-5 h-5" />
                                        <div className="ml-4 flex-1">
                                            <span className="block font-bold text-gray-800">Transferencia Bancaria</span>
                                            <span className="block text-sm text-gray-500">Momentáneamente deshabilitado.</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="mt-8 flex justify-between">
                                    <button onClick={prevStep} className="text-gray-500 hover:text-gray-700 font-semibold px-4">Volver</button>
                                    {/* Payment Button is in the summary panel for desktop, or below here for mobile */}
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="bg-white p-12 rounded-xl shadow-lg border border-green-100 text-center animate-fade-in-up">
                                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaCheckCircle className="text-4xl" />
                                </div>
                                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">¡Pedido Confirmado!</h2>
                                <p className="text-gray-500 mb-8">Gracias por tu compra. Te hemos enviado un correo con los detalles.</p>

                                <button onClick={() => navigate('/profile')} className="px-8 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-all">
                                    Ver mis Pedidos
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Summary Sidebar */}
                    {currentStep !== 4 && (
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100 sticky top-28">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Resumen de Compra</h3>
                                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-600 truncate w-32">{item.name} (x{item.quantity})</span>
                                            <span className="font-semibold">${(parseFloat(item.price.toString().replace(/[^0-9.-]+/g, "")) * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center mb-2 text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-6 text-gray-600">
                                    <span>Envío</span>
                                    <span className="text-green-600 font-semibold">Gratis</span>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between items-center text-2xl font-extrabold text-[#3A1F18]">
                                        <span>Total</span>
                                        <span>${total.toLocaleString()}</span>
                                    </div>
                                </div>

                                {currentStep === 3 && (
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center justify-center ${loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-[#009EE3] hover:bg-[#0089C5]' // Color Mercado Pago
                                            }`}
                                    >
                                        {loading ? 'Procesando...' : 'Pagar Ahora'}
                                    </button>
                                )}

                                <div className="mt-4 flex items-center justify-center text-xs text-gray-400">
                                    <FaLock className="mr-1" /> Compra Segura
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
