// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a0f0c] text-gray-300 pt-16 pb-8 border-t-4 border-amber-600">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Columna 1: Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-extrabold tracking-wider text-white">
                Barista<span className="text-amber-500">Flow</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Tu destino premium para el mundo del café. Desde granos selectos hasta educación experta, elevamos tu experiencia cafetera diaria.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon icon={<FaFacebookF />} href="#" />
              <SocialIcon icon={<FaInstagram />} href="#" />
              <SocialIcon icon={<FaTwitter />} href="#" />
              <SocialIcon icon={<FaLinkedinIn />} href="#" />
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b-2 border-amber-600 inline-block pb-1">Explora</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/about-us">Nuestra Historia</FooterLink>
              <FooterLink to="/courses">Cursos y Talleres</FooterLink>
              <FooterLink to="/products">Tienda de Café</FooterLink>
              <FooterLink to="/recipes">Recetas Exclusivas</FooterLink>
              <FooterLink to="/community">Comunidad</FooterLink>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b-2 border-amber-600 inline-block pb-1">Ayuda</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/contact">Contáctanos</FooterLink>
              <FooterLink to="/faq">Preguntas Frecuentes</FooterLink>
              <FooterLink to="/shipping">Envíos y Devoluciones</FooterLink>
              <FooterLink to="/privacy">Política de Privacidad</FooterLink>
              <FooterLink to="/terms">Términos de Servicio</FooterLink>
            </ul>
          </div>

          {/* Columna 4: Contacto Directo */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 border-b-2 border-amber-600 inline-block pb-1">Visítanos</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-amber-500 mt-1 mr-3 shrink-0" />
                <span>Av. Providencia 1234, Oficina 505<br />Santiago, Chile</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-amber-500 mr-3 shrink-0" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-amber-500 mr-3 shrink-0" />
                <span>baristaflow.cl@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} BaristaFlow. Todos los derechos reservados. Diseñado con ☕ y Pasión.</p>
        </div>
      </div>
    </footer>
  );
};

// Componentes auxiliares para limpieza
const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-amber-500 transition-colors duration-300 flex items-center">
      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
      {children}
    </Link>
  </li>
);

const SocialIcon: React.FC<{ icon: React.ReactNode; href: string }> = ({ icon, href }) => (
  <a
    href={href}
    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
  >
    {icon}
  </a>
);

export default Footer;