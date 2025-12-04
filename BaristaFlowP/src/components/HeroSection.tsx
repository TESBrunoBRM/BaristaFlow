// src/components/HeroSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/a1.jpg'; // Asegúrate de que esta imagen exista o usa una URL externa si es necesario

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">

      {/* Background Image with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: `url(${heroImage})`,
          filter: 'brightness(0.6)'
        }}
      ></div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-[#1a0f0c]"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

        <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold tracking-widest uppercase mb-6 border border-amber-500/30 backdrop-blur-sm animate-fadeIn">
          Bienvenido a la Excelencia
        </span>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-2xl animate-fadeInUp">
          Barista<span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-600">Flow</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 font-light mb-10 max-w-3xl mx-auto leading-relaxed animate-fadeInUp delay-100">
          Descubre el arte del café de especialidad. Desde granos selectos hasta la maestría en cada taza. Tu viaje comienza aquí.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp delay-200">
          <Link
            to="/courses"
            className="px-8 py-4 bg-amber-500 text-[#3A1F18] font-bold rounded-full text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1"
          >
            Explorar Cursos
          </Link>
          <Link
            to="/products"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white hover:text-[#3A1F18] transition-all transform hover:-translate-y-1 backdrop-blur-sm"
          >
            Ver Tienda
          </Link>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full animate-scroll"></div>
        </div>
      </div>

    </div>
  );
};

export default HeroSection;