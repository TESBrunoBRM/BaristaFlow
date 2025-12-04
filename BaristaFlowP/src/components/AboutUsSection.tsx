// src/components/AboutUsSection.tsx
import React from 'react';
import logoImage from '../assets/logo.png'; // Asegúrate de que el nombre del archivo sea correcto (a1.jpg)

const AboutUsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white text-gray-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 md:pr-10 mb-8 md:mb-0">
          <h2 className="text-4xl font-extrabold text-[#3A1F18] mb-4">Quienes somos?</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            En <strong>BaristaFlow</strong> creemos que el café es mucho más que una bebida: es un arte, una experiencia y un punto de encuentro. Nuestra misión es acercar el mundo del café de especialidad a todos, desde quienes recién comienzan a explorar hasta baristas y amantes apasionados que buscan perfeccionar su técnica. Aquí encontrarás una <strong>tienda especializada</strong> con productos, accesorios y granos seleccionados; <strong>recetas y cursos</strong> para aprender, experimentar y llevar tu café al siguiente nivel; y una <strong>comunidad barista</strong> donde compartir conocimientos, resolver dudas e inspirarse mutuamente. Ya sea que quieras preparar un espresso perfecto, descubrir nuevas recetas o formarte como barista profesional, en <strong>BaristaFlow</strong> te acompañamos en cada paso de tu viaje cafetero.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="w-full max-w-lg rounded-lg shadow-xl flex items-center justify-center overflow-hidden">
            <img 
              src={logoImage} 
              alt="Logo de BaristaFlow" 
              className="w-full h-auto object-cover rounded-lg" // Eliminamos la altura fija del img
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;