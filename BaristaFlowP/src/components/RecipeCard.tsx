import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaBalanceScale } from 'react-icons/fa';

// 🚨 CORRECCIÓN IMPORTANTE: Usamos 'import type' para solucionar el error de TypeScript
import type { Recipe } from '../data/recipes';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {

    // Función auxiliar para asignar colores según la dificultad
    const getDifficultyColor = (difficulty: Recipe['difficulty']) => {
        switch (difficulty) {
            case 'Fácil':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Media':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Difícil':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        // Enlace a la página de detalle usando el ID real de la receta
        <Link to={`/recipes/${recipe.id}`} className="group block h-full">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden h-full flex flex-col transition-all duration-300 transform hover:-translate-y-1">

                {/* Imagen de la receta con efecto zoom al hacer hover */}
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Capa oscura sutil al hacer hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                    {/* 🚨 Indicador de Video */}
                    {recipe.videoUrl && (
                        <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center shadow-lg">
                            <span className="mr-1">▶</span> Video
                        </div>
                    )}
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-5 flex flex-col grow">

                    {/* Título */}
                    <h3 className="text-xl font-bold text-[#3A1F18] mb-2 leading-tight group-hover:text-amber-700 transition-colors">
                        {recipe.title}
                    </h3>

                    {/* Descripción corta (truncada a 3 líneas para mantener uniformidad) */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 grow">
                        {recipe.description}
                    </p>

                    {/* Metadatos: Tiempo y Dificultad */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">

                        <div className="flex items-center text-sm text-gray-500 font-medium">
                            <FaClock className="text-amber-500 mr-2" />
                            <span>{recipe.prepTime}</span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(recipe.difficulty)} flex items-center`}>
                            <FaBalanceScale className="mr-1" />
                            {recipe.difficulty}
                        </span>

                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;