// src/pages/CartPage.tsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaArrowRight } from 'react-icons/fa';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, total } = useCart(); // Usamos el total del contexto
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="bg-gray-50 rounded-3xl p-12 inline-block">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Tu carrito está vacío 🛒</h1>
          <p className="text-lg text-gray-500 mb-8">
            Agrega algunos productos para empezar a comprar.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-[#3A1F18] text-white font-bold rounded-full hover:bg-[#523126] transition-colors"
          >
            Ir a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-4xl font-extrabold text-[#3A1F18] text-center mb-12">Tu Carrito de Compras</h1>

      <div className="grid lg:grid-cols-3 gap-12">

        {/* Lista de Productos */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {cart.map(item => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center hover:bg-gray-50 transition-colors">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover mb-4 sm:mb-0 sm:mr-6 shadow-sm"
                />

                <div className="grow text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-gray-500 mb-2">Cantidad: {item.quantity}</p>
                  <p className="text-amber-600 font-bold text-lg">${item.price.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-4 sm:mt-0 p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Eliminar producto"
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumen de Compra */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold text-[#3A1F18] mb-6">Resumen</h2>

            <div className="flex justify-between items-center mb-4 text-gray-600">
              <span>Subtotal</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-gray-600">
              <span>Envío</span>
              <span className="text-green-600 font-semibold">Gratis</span>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-center text-3xl font-extrabold text-[#3A1F18]">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-amber-500 text-[#3A1F18] font-bold rounded-xl shadow-lg hover:bg-amber-600 transition-all transform hover:-translate-y-1 flex items-center justify-center text-lg"
            >
              Finalizar Compra <FaArrowRight className="ml-2" />
            </button>

            <p className="text-xs text-center text-gray-400 mt-4">
              Impuestos incluidos. Envío calculado en el checkout.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;