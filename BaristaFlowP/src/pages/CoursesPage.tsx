import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaBookOpen, FaLaptopHouse, FaExclamationTriangle } from 'react-icons/fa';
import CourseCard from '../components/CourseCard';
import { courseService, type Course } from '../services/courseService';

const CoursesPage: React.FC = () => {
    const { userRole, user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isEducator = userRole === 'educator_approved';

    // ------------------------------------
    // LÓGICA DE CARGA DE DATOS REALES DESDE FIREBASE
    // ------------------------------------
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError(null);

                // Usamos el servicio de Firebase en lugar de la API Express
                const data = await courseService.getAllCourses();
                setCourses(data);

            } catch (err: any) {
                console.error("Error al cargar los cursos:", err);
                setError('No se pudo conectar con el servidor de cursos. Por favor intenta más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // --- RENDERIZADO DE ESTADOS ---

    if (loading) {
        return (
            <div className="text-center py-20 text-xl text-gray-500 flex flex-col items-center">
                <FaSpinner className="inline animate-spin mr-2 text-4xl mb-4" />
                Cargando catálogo de cursos...
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

    // ------------------------------------
    // VISTA PRINCIPAL
    // ------------------------------------
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">

                {/* Título */}
                <h1 className="text-4xl font-extrabold text-[#3A1F18]">Cursos Disponibles</h1>

                {/* Botones de Acción (Solo visibles si hay usuario) */}
                <div className="flex flex-wrap justify-center gap-3">
                    {/* 1. Botón de Ambiente de Aprendizaje (Para cualquier usuario logueado) */}
                    {user && (
                        <Link
                            to="/learning"
                            className="px-5 py-3 bg-[#3A1F18] text-white font-bold rounded-lg shadow-md hover:bg-[#523126] transition-colors flex items-center"
                        >
                            <FaLaptopHouse className="mr-2 text-xl" /> Mi Aula Virtual
                        </Link>
                    )}

                    {/* 2. Botón de Panel Docente (Solo Educadores Aprobados) */}
                    {isEducator && (
                        <Link
                            to="/educator-panel"
                            className="px-5 py-3 bg-amber-500 text-[#3A1F18] font-bold rounded-lg shadow-md hover:bg-amber-600 transition-colors flex items-center"
                        >
                            <FaBookOpen className="mr-2 text-xl" /> Panel Docente
                        </Link>
                    )}
                </div>
            </div>

            {/* Lista de Cursos */}
            {courses.length === 0 ? (
                <p className="text-center text-gray-600 text-lg py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    Actualmente no hay cursos disponibles. ¡Vuelve pronto!
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesPage;