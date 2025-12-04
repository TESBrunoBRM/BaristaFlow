import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { Product } from '../types/product';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

const ProductCarousel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // 🚨 Fetching from the API
        const response = await fetch(`${API_BASE_URL}/api/products`);

        if (!response.ok) {
          throw new Error('Error al cargar productos desde la API');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
        <p className="text-gray-600">Cargando productos destacados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Nuestros Productos Destacados</h2>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="p-2">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#3A1F18] line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 my-2 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-gray-900">
                    ${parseFloat(product.price).toLocaleString()}
                  </span>
                  <button className="px-4 py-2 bg-amber-500 text-[#3A1F18] font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm">
                    Ver Más
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;