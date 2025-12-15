import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseService, type Course } from '../services/courseService';
import {
    FaBookOpen,
    FaCalendarAlt,
    FaChartLine,
    FaPlus,
    FaSpinner,
    FaFileUpload,
    FaExclamationTriangle,
    FaEdit,
    FaArchive // Changed from FaTrash
} from 'react-icons/fa';
import { Navigate, Link } from 'react-router-dom';

const EducatorPanel: React.FC = () => {
    const { userRole, user, loading, userToken } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    const [myCourses, setMyCourses] = useState<Course[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [uploading, setUploading] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    useEffect(() => {
        const fetchEducatorCourses = async () => {
            if (userRole !== 'educator_approved' || !user) return;

            try {
                setLoadingData(true);
                const courses = await courseService.getCoursesByAuthor(user.uid);
                setMyCourses(courses);

            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los datos. Verifica tu conexión.');
            } finally {
                setLoadingData(false);
            }
        };

        fetchEducatorCourses();
    }, [userRole, user]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, courseId: string) => {
        const file = e.target.files?.[0];
        if (!file || !userToken) return;

        setUploading(true);
        setSelectedCourseId(courseId);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert(`Material "${file.name}" subido exitosamente.`);
        } catch {
            alert('Error al subir el material.');
        } finally {
            setUploading(false);
            setSelectedCourseId(null);
            e.target.value = '';
        }
    };

    const handleArchiveCourse = async (courseId: string) => {
        if (!confirm('¿Estás seguro de que quieres archivar este curso? Dejará de aparecer en el catálogo público, pero los alumnos actuales mantendrán su acceso.')) return;

        try {
            await courseService.archiveCourse(courseId);
            // Actualizamos el estado local para reflejar el cambio (Soft delete visual)
            setMyCourses(prev => prev.map(c =>
                c.id === courseId ? { ...c, isArchived: true } : c
            ));
            alert('Curso archivado correctamente.');
        } catch (error) {
            console.error(error);
            alert('Error al archivar el curso.');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-xl text-gray-500">
                <FaSpinner className="inline animate-spin mr-2" /> Cargando panel...
            </div>
        );
    }

    if (userRole !== 'educator_approved') {
        return <Navigate to="/" replace />;
    }



    const DashboardView: React.FC = () => (
        <div className="space-y-8">
            {loadingData ? (
                <div className="text-center py-10"><FaSpinner className="inline animate-spin" /> Cargando estadísticas...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-amber-500">
                        <p className="text-sm text-gray-500">Cursos Creados</p>
                        <h3 className="text-4xl font-bold text-[#3A1F18]">{myCourses.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-amber-500">
                        <p className="text-sm text-gray-500">Envíos de Alumnos</p>
                        <h3 className="text-4xl font-bold text-[#3A1F18]">0</h3>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-amber-500">
                        <p className="text-sm text-gray-500">Calificación Promedio</p>
                        <h3 className="text-4xl font-bold text-[#3A1F18]">-</h3>
                    </div>
                </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">¿Quieres enseñar algo nuevo?</h3>
                <Link to="/create-course" className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                    <FaPlus className="mr-2" /> Crear Nuevo Curso
                </Link>
            </div>
        </div>
    );

    const ContentView: React.FC = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#3A1F18]">Mis Cursos y Materiales</h2>
                <Link to="/create-course" className="flex items-center justify-center px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors text-sm">
                    <FaPlus className="mr-2" /> Nuevo Curso
                </Link>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center">
                    <FaExclamationTriangle className="mr-2" /> {error}
                </div>
            )}

            {loadingData ? (
                <div className="text-center py-10"><FaSpinner className="inline animate-spin" /> Buscando tus cursos...</div>
            ) : myCourses.length > 0 ? (
                <div className="space-y-4">
                    {myCourses.map(course => (
                        <div key={course.id} className={`bg-white p-6 rounded-xl shadow-md border ${course.isArchived ? 'border-gray-300 bg-gray-50 opacity-80' : 'border-gray-100'} flex flex-col md:flex-row justify-between items-center gap-4`}>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <img src={course.image} alt={course.title} className="w-16 h-16 rounded object-cover shadow-sm grayscale-[0.2]" />
                                <div className="min-w-0">
                                    <h3 className="font-bold text-lg text-gray-800 truncate flex items-center gap-2">
                                        {course.title}
                                        {course.isArchived && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full border border-gray-300">Archivado</span>}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <Link to={`/edit-course/${course.id}`} className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded hover:bg-gray-200 transition-colors flex items-center justify-center">
                                    <FaEdit className="mr-2" /> Editar
                                </Link>

                                <label className={`flex-1 md:flex-none cursor-pointer flex justify-center items-center px-4 py-2 rounded-md text-sm font-bold transition-colors ${uploading && selectedCourseId === course.id ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-amber-500 text-[#3A1F18] hover:bg-amber-600'}`}>
                                    {uploading && selectedCourseId === course.id ? (
                                        <><FaSpinner className="animate-spin mr-2" /> Subiendo...</>
                                    ) : (
                                        <><FaFileUpload className="mr-2" /> Material</>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        disabled={uploading && selectedCourseId === course.id}
                                        onChange={(e) => handleFileUpload(e, course.id)}
                                    />
                                </label>

                                <button
                                    onClick={() => handleArchiveCourse(course.id)}
                                    className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-600 font-semibold rounded hover:bg-red-100 transition-colors flex items-center justify-center"
                                    title={course.isArchived ? "Curso ya archivado" : "Archivar curso"}
                                    disabled={course.isArchived}
                                >
                                    <FaArchive />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4 text-lg">Aún no has creado ningún curso.</p>
                    <p className="text-sm text-gray-400 mb-6">Tus cursos aparecerán aquí una vez que los publiques.</p>
                    <Link to="/create-course" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md">
                        ¡Comienza a Enseñar!
                    </Link>
                </div>
            )}
        </div>
    );

    const ScheduleView: React.FC = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#3A1F18]">Agenda de Clases</h2>
                <button className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    <FaCalendarAlt className="mr-2" /> Nueva Sesión
                </button>
            </div>

            <div className="p-12 bg-gray-50 rounded-lg text-center border border-gray-200">
                <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">El sistema de calendario y agendamiento se integrará próximamente.</p>
            </div>
        </div>
    );

    const renderView = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardView />;
            case 'content': return <ContentView />;
            case 'schedule': return <ScheduleView />;
            default: return <DashboardView />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex flex-col md:flex-row justify-between items-center border-l-8 border-amber-500">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#3A1F18]">Panel de Educador</h1>
                        <p className="text-gray-500 mt-2">Gestiona tus cursos, estudiantes y contenido desde aquí.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <Link to="/create-course" className="flex items-center px-6 py-3 bg-[#3A1F18] text-white font-bold rounded-xl shadow-lg hover:bg-[#523126] transition-all transform hover:-translate-y-1">
                            <FaPlus className="mr-2" /> Crear Curso
                        </Link>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-8 overflow-x-auto">
                    {['dashboard', 'content', 'schedule'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center ${activeTab === tab
                                ? 'bg-amber-100 text-amber-800 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {tab === 'dashboard' && <FaChartLine className="mr-2" />}
                            {tab === 'content' && <FaBookOpen className="mr-2" />}
                            {tab === 'schedule' && <FaCalendarAlt className="mr-2" />}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[500px]">
                    {renderView()}
                </div>

            </div>
        </div>
    );
};

export default EducatorPanel;