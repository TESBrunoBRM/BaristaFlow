// src/pages/CourseDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService, type Course } from '../services/courseService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // 🚨 Importar useAuth
import { FaSpinner, FaShoppingCart, FaClock, FaLayerGroup, FaChalkboardTeacher, FaArrowLeft, FaLock } from 'react-icons/fa';

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth(); // 🚨 Obtener usuario
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await courseService.getCourseById(id);
                setCourse(data);
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("No se pudo cargar el curso.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleAddToCart = () => {
        if (course) {
            addToCart({
                id: course.id, // Ahora compatible (string | number)
                name: course.title,
                price: course.price, // Asumimos que es string como "$19.99"
                image: course.image,
                category: 'accesorios', // Dummy category for compatibility
                description: course.description
            });
            alert('Curso agregado al carrito!');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-4xl text-amber-600" /></div>;
    if (error || !course) return <div className="text-center py-20 text-red-600 font-bold">{error || "Curso no encontrado"}</div>;

    // 🚨 Lógica de permisos para ver el contenido HTML
    const isAuthor = user && course.authorId === user.uid;
    // const isEnrolled = ... (Pendiente de implementar lógica real de inscripción)
    const canViewContent = isAuthor; // Por ahora solo el autor puede ver el contenido en esta vista

    return (
        <div className="container mx-auto px-4 py-12">
            <button onClick={() => navigate('/courses')} className="flex items-center text-gray-600 hover:text-amber-600 mb-6 transition-colors">
                <FaArrowLeft className="mr-2" /> Volver a Cursos
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header con Imagen */}
                <div className="relative h-64 md:h-96">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                        <div className="p-8 text-white">
                            <h1 className="text-4xl font-extrabold mb-2">{course.title}</h1>
                            <p className="text-lg opacity-90">{course.level} • {course.duration}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Columna Principal: Descripción y Contenido */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#3A1F18] mb-4">Descripción del Curso</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">{course.description}</p>
                        </div>

                        {/* 🚨 RENDERIZADO DE CONTENIDO HTML (IFRAME) 🚨 */}
                        {course.htmlContent && (
                            <div className="mt-8 border-t pt-8">
                                <h2 className="text-2xl font-bold text-[#3A1F18] mb-4">Contenido Interactivo / Lección</h2>

                                {canViewContent ? (
                                    <>
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                                            <iframe
                                                srcDoc={course.htmlContent}
                                                title="Contenido del Curso"
                                                className="w-full h-[500px]"
                                                sandbox="allow-scripts" // Permitimos scripts básicos pero aislados
                                                style={{ border: 'none' }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 italic">
                                            * Vista previa disponible para el instructor.
                                        </p>
                                    </>
                                ) : (
                                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 text-center">
                                        <FaLock className="text-4xl text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-gray-700">Contenido Protegido</h3>
                                        <p className="text-gray-500">Debes estar inscrito en este curso para ver el contenido interactivo.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Detalles y Acción */}
                    <div className="md:col-span-1">
                        <div className="bg-amber-50 rounded-xl p-6 shadow-md sticky top-24">
                            <div className="text-3xl font-bold text-[#3A1F18] mb-6 text-center">{course.price}</div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full py-4 bg-amber-500 text-[#3A1F18] font-bold rounded-lg shadow-lg hover:bg-amber-600 transform hover:-translate-y-1 transition-all flex justify-center items-center text-lg"
                            >
                                <FaShoppingCart className="mr-2" /> Agregar al Carrito
                            </button>

                            <div className="mt-8 space-y-4 text-gray-700">
                                <div className="flex items-center">
                                    <FaClock className="text-amber-600 mr-3 text-xl" />
                                    <span><strong>Duración:</strong> {course.duration}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaLayerGroup className="text-amber-600 mr-3 text-xl" />
                                    <span><strong>Nivel:</strong> {course.level}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaChalkboardTeacher className="text-amber-600 mr-3 text-xl" />
                                    <span><strong>Instructor:</strong> {course.authorName || 'BaristaFlow'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
