import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch desde la API local
        const response = await fetch(`${API_BASE_URL}/api/products`);

        if (!response.ok) {
          throw new Error('Error al cargar los productos');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("No se pudieron cargar los productos. Asegúrate de que la API esté corriendo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!category) {
      return products;
    }
    return products.filter(product => product.category === category);
  }, [category, products]);

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Todos';

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-500 flex flex-col items-center">
        <FaSpinner className="inline animate-spin mr-2 text-4xl mb-4" />
        Cargando catálogo de productos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-xl inline-block">
          <FaExclamationTriangle className="text-4xl mb-2 mx-auto text-red-500" />
          <h3 className="font-bold text-lg mb-2">Error de Conexión</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
        Nuestros Productos: <span className="text-[#3A1F18]">{categoryName}</span>
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No se encontraron productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;