import React from 'react';
import { FaCoffee, FaUsers, FaLeaf } from 'react-icons/fa';

const HistoryPage: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-[#3A1F18] text-white py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-extrabold mb-4">Nuestra Historia</h1>
                    <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                        De una pequeña pasión a una comunidad global de amantes del café.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 max-w-5xl">

                {/* Section 1: The Beginning */}
                <div className="flex flex-col md:flex-row items-center mb-20 gap-12">
                    <div className="md:w-1/2">
                        <div className="bg-amber-100 rounded-full p-8 inline-block mb-6">
                            <FaCoffee className="text-6xl text-[#3A1F18]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#3A1F18] mb-4">El Comienzo</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            BaristaFlow nació en 2025, en medio de la búsqueda de la taza de café perfecta en casa. Lo que comenzó como un blog personal para documentar recetas y métodos de extracción, rápidamente resonó con miles de personas que buscaban elevar su ritual matutino.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.1.0&auto=format&fit=crop&w=1000&q=80"
                            alt="Cafetería origen"
                            className="rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Section 2: The Mission */}
                <div className="flex flex-col md:flex-row-reverse items-center mb-20 gap-12">
                    <div className="md:w-1/2">
                        <div className="bg-green-100 rounded-full p-8 inline-block mb-6">
                            <FaLeaf className="text-6xl text-green-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#3A1F18] mb-4">Nuestra Misión</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Creemos que el café de especialidad debe ser accesible para todos. Nuestra misión es democratizar el conocimiento del barista profesional, ofreciendo educación de calidad, granos éticamente obtenidos y las mejores herramientas del mercado.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1628236876894-dbde8ff5a944?q=80&w=742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Granos de café"
                            className="rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Section 3: Community */}
                <div className="text-center bg-gray-50 p-12 rounded-3xl">
                    <FaUsers className="text-6xl text-amber-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-[#3A1F18] mb-6">Una Comunidad Creciente</h2>
                    <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
                        Hoy, BaristaFlow es más que una tienda; es un ecosistema. Con más de 50 cursos, miles de estudiantes y una red de caficultores asociados, seguimos creciendo día a día, unidos por una simple pero poderosa pasión: el amor por el buen café.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default HistoryPage;
