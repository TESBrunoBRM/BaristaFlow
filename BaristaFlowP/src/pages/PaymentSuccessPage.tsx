import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaBoxOpen, FaArrowRight } from 'react-icons/fa';

const PaymentSuccessPage: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg w-full border-t-8 border-green-500">

                <div className="mb-6 animate-bounce">
                    <FaCheckCircle className="text-7xl text-green-500 mx-auto" />
                </div>

                <h1 className="text-3xl font-extrabold text-[#3A1F18] mb-4">¡Pago Exitoso!</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Gracias por tu compra. Tu pedido ha sido confirmado y pronto comenzaremos a prepararlo con el mejor aroma a café.
                </p>

                <div className="bg-amber-50 p-4 rounded-xl mb-8 text-left">
                    <p className="text-sm text-gray-500 mb-1">ID de Transacción:</p>
                    <p className="font-mono font-bold text-[#3A1F18]">MP-{Math.floor(Math.random() * 1000000000)}</p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/profile"
                        className="w-full py-3 bg-[#3A1F18] text-white rounded-xl font-bold hover:bg-[#523126] transition-colors flex items-center justify-center"
                    >
                        <FaBoxOpen className="mr-2" /> Ver Mis Pedidos
                    </Link>

                    <Link
                        to="/"
                        className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                        Volver al Inicio <FaArrowRight className="ml-2" />
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default PaymentSuccessPage;
