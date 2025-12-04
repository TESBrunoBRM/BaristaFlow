// src/components/ProductCard.tsx
import React from 'react';
import type { Product } from '../types/product';
import { useCart } from '../context/CartContext.tsx'; // Importa el hook

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-transform transform hover:scale-105">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#3A1F18] mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-semibold text-gray-900">{product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2 bg-amber-500 text-[#3A1F18] font-bold rounded-lg shadow-md hover:bg-amber-600 transition-colors"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;