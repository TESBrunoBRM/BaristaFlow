// src/components/DropdownMenu.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleMenu} 
        className="text-white hover:text-amber-300 transition-colors duration-300 focus:outline-none"
      >
        Productos
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50">
          <Link to="/products" className="block px-4 py-2 hover:bg-gray-200">Todos los productos</Link>
          <Link to="/products?category=grano" className="block px-4 py-2 hover:bg-gray-200">Café en grano</Link>
          <Link to="/products?category=cafeteras" className="block px-4 py-2 hover:bg-gray-200">Cafeteras/prensas</Link>
          <Link to="/products?category=maquinas" className="block px-4 py-2 hover:bg-gray-200">Máquinas</Link>
          <Link to="/products?category=molinos" className="block px-4 py-2 hover:bg-gray-200">Molinos</Link>
          <Link to="/products?category=accesorios" className="block px-4 py-2 hover:bg-gray-200">Accesorios</Link>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;