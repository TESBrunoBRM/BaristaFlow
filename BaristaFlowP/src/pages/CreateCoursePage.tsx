// src/pages/CreateCoursePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';
import { FaSpinner, FaCloudUploadAlt, FaMoneyBillWave, FaClock, FaLayerGroup, FaChalkboardTeacher, FaLink, FaImage } from 'react-icons/fa';

const CreateCoursePage: React.FC = () => {
    const { user, userRole } = useAuth();
    const navigate = useNavigate();

    // Estados del formulario
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [level, setLevel] = useState<'Básico' | 'Intermedio' | 'Avanzado'>('Básico');
    const [htmlContent, setHtmlContent] = useState(''); // 🚨 Nuevo estado para HTML

    // Estados para manejar la imagen (Archivo o URL)
    const [imageType, setImageType] = useState<'file' | 'url'>('url');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');

    const [loading, setLoading] = useState(false);

    // Protección de ruta: Solo educadores aprobados
    if (userRole !== 'educator_approved') {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-red-600">Acceso Restringido</h2>
                <p className="text-gray-600 mt-2">Solo los educadores verificados pueden crear nuevos cursos.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 text-amber-600 hover:underline font-semibold"
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Validación de imagen
        if (imageType === 'file' && !imageFile) {
            alert("Por favor, selecciona un archivo de imagen.");
            return;
        }
        if (imageType === 'url' && !imageUrl) {
            alert("Por favor, ingresa una URL de imagen válida.");
            return;
        }

        setLoading(true);

        try {
            let finalImageUrl = '';

            // 1. Resolver la imagen
            if (imageType === 'file') {
                // Simulación de subida de archivo (hasta tener Storage)
                await new Promise(resolve => setTimeout(resolve, 1000));
                finalImageUrl = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop'; // Placeholder
            } else {
                finalImageUrl = imageUrl;
            }

            // 2. Preparar datos del curso
            const courseData = {
                title,
                description,
                price,
                duration,
                level,
                image: finalImageUrl,
                authorId: user.uid,
                authorName: user.displayName || user.email || 'Instructor',
                htmlContent, // 🚨 Incluimos el HTML
            };

            // 3. Enviar a Firebase usando courseService
            await courseService.createCourse(courseData);

            alert('¡Curso creado exitosamente!');
            navigate('/educator-panel');

        } catch (error) {
            console.error("Error al crear curso:", error);
            alert('Hubo un problema al guardar el curso. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-t-8 border-amber-600">
                <div className="text-center mb-10">
                    <FaChalkboardTeacher className="text-5xl text-amber-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold text-[#3A1F18]">Publicar Nuevo Curso</h1>
                    <p className="text-gray-500 mt-2">Crea contenido para la comunidad de BaristaFlow.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Título */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Título del Curso</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Ej: Arte Latte Avanzado"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descripción Detallada</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            placeholder="Describe lo que aprenderán los estudiantes..."
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Precio */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                                <FaMoneyBillWave className="mr-2 text-amber-600" /> Precio (USD)
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                placeholder="Ej: 49.99"
                                min="0"
                                step="0.01"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>

                        {/* Duración */}
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                                <FaClock className="mr-2 text-amber-600" /> Duración Estimada
                            </label>
                            <input
                                type="text"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                                placeholder="Ej: 4 semanas"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Nivel */}
                    <div>
                        <label className="text-sm font-bold text-gray-700 mb-1 flex items-center">
                            <FaLayerGroup className="mr-2 text-amber-600" /> Nivel
                        </label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value as 'Básico' | 'Intermedio' | 'Avanzado')}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white cursor-pointer"
                        >
                            <option value="Básico">Básico</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Avanzado">Avanzado</option>
                        </select>
                    </div>

                    {/* Imagen de Portada (Selector) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Imagen de Portada</label>

                        <div className="flex mb-4 border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => setImageType('url')}
                                className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center transition-colors ${imageType === 'url' ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FaLink className="mr-2" /> Usar URL (Recomendado)
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageType('file')}
                                className={`flex-1 py-2 text-sm font-semibold flex items-center justify-center transition-colors ${imageType === 'file' ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FaCloudUploadAlt className="mr-2" /> Subir Archivo
                            </button>
                        </div>

                        {/* Opción URL */}
                        {imageType === 'url' && (
                            <div className="space-y-3 animate-fade-in">
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/photo-..."
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                                />
                                {imageUrl && (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 shadow-sm mt-2 bg-gray-100">
                                        <img
                                            src={imageUrl}
                                            alt="Vista previa"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">Vista Previa</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Opción Archivo */}
                        {imageType === 'file' && (
                            <div className="flex flex-col items-center justify-center w-full animate-fade-in">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-amber-50 hover:border-amber-400 transition-all group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FaImage className="w-8 h-8 mb-2 text-gray-400 group-hover:text-amber-500 transition-colors" />
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Haz clic para subir</span></p>
                                        <p className="text-xs text-gray-500">JPG, PNG</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageFileChange} />
                                </label>
                                {imageFile && <p className="mt-2 text-sm text-green-600 font-semibold">Archivo: {imageFile.name}</p>}
                            </div>
                        )}
                    </div>

                    {/* Botón Submit */}
                    {/* 🚨 NUEVO CAMPO: Contenido HTML / Archivo */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contenido Interactivo (HTML)
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Puedes pegar código HTML aquí o subir un archivo .html para tus lecciones.
                        </p>

                        {/* Input de Archivo */}
                        <div className="mb-3">
                            <input
                                type="file"
                                accept=".html"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            setHtmlContent(ev.target?.result as string);
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                            />
                        </div>

                        {/* Textarea para edición manual */}
                        <textarea
                            name="htmlContent"
                            value={htmlContent}
                            onChange={(e) => setHtmlContent(e.target.value)}
                            placeholder="<h1>Mi Lección</h1><p>Contenido...</p>"
                            rows={6}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 font-bold text-white text-lg rounded-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3A1F18] hover:bg-amber-700 hover:shadow-xl'}`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" /> Publicando...
                            </>
                        ) : (
                            'Publicar Curso'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCoursePage;
