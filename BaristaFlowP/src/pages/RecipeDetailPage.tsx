// src/pages/RecipeDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaClock, FaFire, FaBalanceScale } from 'react-icons/fa';

// Importa los datos de las recetas
import { recipes } from '../data/recipes';
import type { Recipe } from '../data/recipes';

const RecipeDetailPage: React.FC = () => {
  // Obtiene los parámetros de la URL. 'id' es el nombre que usaremos en la Route
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    // Busca la receta por el ID en los datos
    const foundRecipe = recipes.find(r => r.id === id);
    setRecipe(foundRecipe || null);
  }, [id]);

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Receta no encontrada</h1>
        <p className="text-gray-600 mb-6">Parece que la receta que buscas no existe.</p>
        <Link to="/recipes" className="text-amber-600 hover:text-amber-800 font-semibold transition-colors">
          Volver a la lista de Recetas
        </Link>
      </div>
    );
  }

  // Helper para mostrar iconos basados en la dificultad
  const getDifficultyColor = (difficulty: Recipe['difficulty']) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-100 text-green-700';
      case 'Media':
        return 'bg-yellow-100 text-yellow-700';
      case 'Difícil':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Imagen de Cabecera */}
        <div className="relative h-96">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-10">
            <h1 className="text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
              {recipe.title}
            </h1>
          </div>
        </div>

        <div className="p-8 md:p-12 lg:p-16">

          {/* Metadata: Tiempo, Método, Dificultad */}
          <section className="flex flex-wrap justify-between items-center gap-6 mb-12 p-6 bg-gray-50 rounded-xl border border-amber-500/30">

            <div className="flex items-center text-[#3A1F18] font-semibold text-lg">
              <FaClock className="mr-3 text-amber-600 text-2xl" />
              <span>Tiempo Total: {recipe.prepTime}</span>
            </div>

            <div className="flex items-center text-[#3A1F18] font-semibold text-lg">
              <FaFire className="mr-3 text-amber-600 text-2xl" />
              <span>Método: {recipe.method}</span>
            </div>

            <div className={`px-4 py-2 rounded-full font-bold text-sm ${getDifficultyColor(recipe.difficulty)}`}>
              <FaBalanceScale className="inline mr-2" />
              Dificultad: {recipe.difficulty}
            </div>

          </section>

          {/* Sección de Descripción */}
          <section className="mb-16">
            <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-amber-500 pl-4">
              "{recipe.description}"
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Columna de Ingredientes (1/3) */}
            <section className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-[#3A1F18] mb-6 border-b-2 border-gray-200 pb-2">
                Ingredientes
              </h2>
              <ul className="space-y-4 text-lg text-gray-800">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-600 text-2xl mr-3 mt-1">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </section>

            {/* Columna de Instrucciones (2/3) */}
            <section className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-[#3A1F18] mb-6 border-b-2 border-gray-200 pb-2">
                Instrucciones
              </h2>
              <ol className="space-y-8">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white font-extrabold mr-4 text-xl">
                      {index + 1}
                    </span>
                    <p className="text-lg text-gray-800 pt-0.5">{instruction}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* 🚨 SECCIÓN DE VIDEO 🚨 */}
          {recipe.videoUrl && (
            <section className="mt-16 mb-8">
              <h2 className="text-3xl font-bold text-[#3A1F18] mb-6 border-b-2 border-gray-200 pb-2 flex items-center">
                <span className="mr-3">🎥</span> Video Tutorial
              </h2>
              <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-xl border-4 border-amber-500/20">
                <iframe
                  src={recipe.videoUrl}
                  title={`Video tutorial de ${recipe.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[400px] md:h-[500px]"
                ></iframe>
              </div>
            </section>
          )}

        </div>
      </article>

      <div className="text-center mt-12">
        <Link
          to="/recipes"
          className="inline-block px-8 py-3 bg-[#3A1F18] text-white font-bold rounded-full shadow-lg hover:bg-[#5A3F28] transition-colors"
        >
          ← Volver a todas las recetas
        </Link>
      </div>

    </div>
  );
};

export default RecipeDetailPage;