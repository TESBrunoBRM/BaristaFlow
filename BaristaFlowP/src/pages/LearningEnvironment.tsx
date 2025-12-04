import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBookReader, FaPlayCircle, FaCheckCircle, FaChalkboardTeacher, FaSpinner, FaFileUpload, FaExclamationTriangle, FaPlusCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Definición del tipo de Curso
interface Course {
  id: number;
  title: string;
  image: string;
  description: string;
  progress?: number;
  nextLesson?: string;
  authorId?: string;
}

const LearningEnvironment: React.FC = () => {
  const { user, userRole, userToken } = useAuth();
  const isEducator = userRole === 'educator_approved';

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // A. Cursos Inscritos (Estudiante) - Vacío por ahora
        setEnrolledCourses([]);

        // B. Cursos Creados (Educador)
        if (isEducator) {
          const response = await fetch('http://localhost:3000/api/courses');

          if (!response.ok) {
            throw new Error('Error al conectar con el servidor de cursos.');
          }

          const allCourses: Course[] = await response.json();

          // Filtrar cursos creados por el usuario actual
          const myCourses = allCourses.filter(course => course.authorId === user.uid);

          setCreatedCourses(myCourses);
        }

      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información. Verifica que el servidor backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isEducator]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, courseId: number) => {
    const file = e.target.files?.[0];
    if (!file || !userToken) return;

    setUploading(true);
    setSelectedCourseId(courseId);

    try {
      // Aquí iría la subida real a Firebase Storage
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

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        <FaSpinner className="inline animate-spin mr-2" /> Cargando tu espacio...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">

      <div className="bg-[#3A1F18] text-white rounded-2xl p-8 mb-10 shadow-xl flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hola, {user?.displayName || 'Barista'} 👋</h1>
          <p className="text-amber-100">
            {isEducator ? 'Panel de Gestión Académica.' : 'Bienvenido a tu espacio de aprendizaje.'}
          </p>
        </div>

        {isEducator && (
          <Link
            to="/educator-panel"
            className="mt-4 md:mt-0 px-6 py-3 bg-amber-500 text-[#3A1F18] font-bold rounded-lg shadow-md hover:bg-amber-600 transition-colors flex items-center"
          >
            <FaChalkboardTeacher className="mr-2" /> Panel Docente Completo
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center">
          <FaExclamationTriangle className="mr-2" /> {error}
        </div>
      )}

      {isEducator && (
        <div className="mb-12 border-b-2 border-gray-100 pb-12">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-[#3A1F18] flex items-center">
              <FaChalkboardTeacher className="mr-2" /> Mis Cursos Creados
            </h2>
            <Link
              to="/create-course"
              className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition-colors flex items-center"
            >
              <FaPlusCircle className="mr-2" /> Crear Nuevo Curso
            </Link>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            {createdCourses.length > 0 ? (
              <>
                <p className="text-gray-700 mb-4">Gestiona el material de tus cursos:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {createdCourses.map(course => (
                    <div key={`edu-${course.id}`} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img src={course.image} alt={course.title} className="w-12 h-12 rounded object-cover shrink-0" />
                          <span className="font-bold text-gray-800 truncate">{course.title}</span>
                        </div>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">Instructor</span>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <label className={`flex-1 cursor-pointer flex justify-center items-center px-3 py-2 rounded-md text-sm font-bold transition-colors ${uploading && selectedCourseId === course.id ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#3A1F18] text-white hover:bg-amber-900'}`}>
                          {uploading && selectedCourseId === course.id ? (
                            <><FaSpinner className="animate-spin mr-2" /> Subiendo...</>
                          ) : (
                            <><FaFileUpload className="mr-2" /> Subir Material</>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            disabled={uploading && selectedCourseId === course.id}
                            onChange={(e) => handleFileUpload(e, course.id)}
                          />
                        </label>
                        <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors" title="Editar detalles">
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4 italic">No has creado ningún curso todavía.</p>
                <p className="text-sm text-gray-400 mb-4">Tus cursos aparecerán aquí una vez que los publiques.</p>
                <Link to="/create-course" className="inline-block px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-semibold">
                  ¡Crea tu primer curso ahora!
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#3A1F18] mb-6 flex items-center">
        <FaBookReader className="mr-2" /> Mi Aprendizaje (Cursos Inscritos)
      </h2>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col md:flex-row">
              <img src={course.image} alt={course.title} className="w-full md:w-48 h-48 object-cover" />
              <div className="p-6 grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">Siguiente: Lección pendiente...</p>
                </div>
                <button className="w-full py-2 bg-[#3A1F18] text-white font-bold rounded-lg hover:bg-amber-900 transition-colors flex items-center justify-center">
                  <FaPlayCircle className="mr-2" /> Continuar Aprendiendo
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg mb-4 font-medium">No estás inscrito en ningún curso.</p>
          <Link to="/solutions" className="inline-block px-6 py-3 bg-amber-500 text-[#3A1F18] font-bold rounded-lg hover:bg-amber-600 transition-colors">
            Explorar Catálogo de Cursos
          </Link>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#3A1F18] mb-6 flex items-center">
          <FaCheckCircle className="mr-2" /> Mis Certificados
        </h2>
        <div className="p-6 bg-white rounded-xl border border-gray-200 text-center text-gray-500 italic">
          <p>Completa tus cursos para desbloquear certificados profesionales.</p>
        </div>
      </div>

    </div>
  );
};

export default LearningEnvironment;