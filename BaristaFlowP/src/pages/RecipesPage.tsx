// src/pages/RecipesPage.tsx
import React from 'react';
import RecipeCard from '../components/RecipeCard'; // Asegúrate de que este componente existe
import { recipes } from '../data/recipes'; // 🚨 Importamos el array de recetas
import type { Recipe } from '../data/recipes'; // 🚨 Importamos el tipo Recipe

const RecipesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[#3A1F18] text-center mb-4">Recetas</h1>
      <p className="text-center text-gray-600 mb-10">Aquí encontrarás todas las recetas de café para preparar en casa.</p>
      
      {recipes.length === 0 ? (
        <p className="text-center text-gray-500 text-lg py-10">Aún no hay recetas publicadas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {recipes.map((recipe: Recipe) => (
            // 🚨 Usamos el componente RecipeCard para cada receta
            <RecipeCard key={recipe.id} recipe={recipe} /> 
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;