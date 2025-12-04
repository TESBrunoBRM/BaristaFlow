import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    FaEdit,
    FaSignOutAlt,
    FaCamera,
    FaSpinner,
    FaGraduationCap,
    FaBookOpen,
    FaCog,
    FaCheck
} from 'react-icons/fa';
import { database, storage } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserStats {
    followers: number;
    following: number;
    coursesEnrolled: number;
}

const ProfilePage: React.FC = () => {
    const { user, logout, userRole } = useAuth();
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [stats, setStats] = useState<UserStats>({ followers: 0, following: 0, coursesEnrolled: 0 });

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [newName, setNewName] = useState('');
    const [bio, setBio] = useState('');

    const [loadingData, setLoadingData] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const userRef = ref(database, 'users/' + user.uid);

        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setDisplayName(data.username || user.displayName || 'Usuario BaristaFlow');
                setDescription(data.description || '¡Hola! Me encanta el café.');
                setNewName(data.username || user.displayName || 'Usuario BaristaFlow');
                setBio(data.description || '¡Hola! Me encanta el café.');

                // Helper to count followers/following correctly
                const count = (val: any) => {
                    if (!val) return 0;
                    if (typeof val === 'number') return val;
                    if (typeof val === 'object') return Object.keys(val).length;
                    return 0;
                };

                setStats({
                    followers: count(data.followers),
                    following: count(data.following),
                    coursesEnrolled: data.coursesEnrolled || 0,
                });
            } else {
                setDisplayName(user.displayName || 'Usuario BaristaFlow');
                setDescription('¡Hola! Me encanta el café.');
                setNewName(user.displayName || 'Usuario BaristaFlow');
                setBio('¡Hola! Me encanta el café.');
            }
            setLoadingData(false);
        }, (error) => {
            console.error("Error al leer datos de Realtime Database:", error);
            setLoadingData(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSaveName = async () => {
        if (!user) return;
        try {
            const userRef = ref(database, 'users/' + user.uid);
            await update(userRef, { username: newName });
            setIsEditingName(false);
        } catch (error) {
            console.error('Error al guardar nombre:', error);
        }
    };

    const handleSaveBio = async () => {
        if (!user) return;
        try {
            const userRef = ref(database, 'users/' + user.uid);
            await update(userRef, { description: bio });
            setIsEditingBio(false);
        } catch (error) {
            console.error('Error al guardar bio:', error);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const MAX_SIZE_MB = 1;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`El archivo es demasiado grande. Máximo permitido: ${MAX_SIZE_MB}MB.`);
            return;
        }

        setUploading(true);
        try {
            const fileRef = storageRef(storage, `profile_photos/${user.uid}/profile_${Date.now()}`);
            await uploadBytes(fileRef, file);
            const photoURL = await getDownloadURL(fileRef);

            await updateProfile(user, { photoURL });
            const userDbRef = ref(database, 'users/' + user.uid);
            await update(userDbRef, { photoURL });

            alert('Foto de perfil actualizada con éxito.');
            window.location.reload();
        } catch (error) {
            console.error('Error al subir la foto:', error);
            alert('Error al subir la foto. Revisa las reglas de Storage.');
        } finally {
            setUploading(false);
        }
    };

    // --- SECCIÓN MIS PUBLICACIONES ---
    const MyBlogsSection = () => {
        const [myBlogs, setMyBlogs] = React.useState<any[]>([]);

        React.useEffect(() => {
            const fetchMyBlogs = async () => {
                try {
                    const response = await axios.get('http://localhost:3000/api/blogs');
                    const allBlogs = response.data;
                    const userBlogs = allBlogs.filter((blog: any) => blog.authorId === user?.uid);
                    setMyBlogs(userBlogs);
                } catch (error) {
                    console.error("Error fetching user blogs:", error);
                }
            };
            if (user) {
                fetchMyBlogs();
            }
        }, [user]);

        if (myBlogs.length === 0) {
            return (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-amber-100">
                    <p className="text-amber-800 mb-4">Aún no has publicado ningún blog.</p>
                    <button
                        onClick={() => navigate('/create-blog')}
                        className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors"
                    >
                        Crear mi primer post
                    </button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myBlogs.map((blog) => (
                    <div key={blog.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow">
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-amber-900 mb-2 truncate">{blog.title}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">{blog.date}</span>
                                <button
                                    onClick={() => navigate(`/edit-blog/${blog.id}`)}
                                    className="px-4 py-1.5 bg-amber-100 text-amber-800 text-sm rounded-full hover:bg-amber-200 transition-colors font-medium"
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // --- SECCIÓN MIS CURSOS ---
    const MyCoursesSection = () => {
        // TODO: Implementar fetch de cursos reales del usuario
        // Por ahora, mostramos estado vacío para cumplir con "solo datos reales"
        const myCourses: any[] = [];

        if (myCourses.length === 0) {
            return (
                <div className="text-center py-8 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-amber-800 mb-2">No tienes cursos activos por el momento.</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="text-amber-600 font-semibold hover:underline text-sm"
                    >
                        Explorar cursos disponibles →
                    </button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aquí irían los cursos reales mapeados */}
            </div>
        );
    };

    if (!user || loadingData) {
        return <div className="text-center py-20 text-xl text-gray-500"><FaSpinner className="inline animate-spin mr-2" /> Cargando perfil...</div>;
    }

    return (
        <div className="min-h-screen bg-amber-50 font-sans">
            {/* Header eliminado para evitar duplicados (ya está en App.tsx) */}

            {/* Header Background */}
            <div className="h-64 bg-linear-to-r from-[#3A1F18] to-amber-900 relative">
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="container mx-auto px-4 -mt-32 pb-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Izquierdo - Perfil */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="relative group">
                                    <input
                                        type="file"
                                        id="photoUpload"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                    <div className="relative">
                                        <img
                                            src={user?.photoURL || "https://via.placeholder.com/150"}
                                            alt="Profile"
                                            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg mb-4 group-hover:opacity-90 transition-opacity"
                                        />
                                        <label htmlFor="photoUpload" className="absolute bottom-4 right-4 bg-amber-600 p-2 rounded-full text-white shadow-md hover:bg-amber-700 transition-colors cursor-pointer">
                                            {uploading ? <FaSpinner className="animate-spin" /> : <FaCamera size={16} />}
                                        </label>
                                    </div>
                                </div>

                                {isEditingName ? (
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="border border-amber-300 rounded px-2 py-1 text-lg font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <button onClick={handleSaveName} className="text-green-600 hover:text-green-700"><FaCheck /></button>
                                    </div>
                                ) : (
                                    <h1 className="text-3xl font-bold text-amber-900 mb-1 flex items-center justify-center gap-2">
                                        {displayName}
                                        <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-amber-600 text-sm"><FaEdit /></button>
                                    </h1>
                                )}

                                <p className="text-gray-500 mb-6">{user?.email}</p>

                                {/* Stats Row */}
                                <div className="flex justify-center gap-8 w-full border-t border-b border-gray-100 py-4 mb-6">
                                    <div>
                                        <span className="block text-2xl font-bold text-amber-800">{stats.coursesEnrolled}</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-wide">Cursos</span>
                                    </div>
                                    <div>
                                        <span className="block text-2xl font-bold text-amber-800">{stats.followers}</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-wide">Seguidores</span>
                                    </div>
                                    <div>
                                        <span className="block text-2xl font-bold text-amber-800">{stats.following}</span>
                                        <span className="text-xs text-gray-500 uppercase tracking-wide">Siguiendo</span>
                                    </div>
                                </div>

                                {/* About Section */}
                                <div className="w-full text-left mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-amber-900">Sobre Mí</h3>
                                        {!isEditingBio && (
                                            <button onClick={() => setIsEditingBio(true)} className="text-xs text-amber-600 hover:underline">Editar</button>
                                        )}
                                    </div>
                                    {isEditingBio ? (
                                        <div>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                className="w-full p-2 border border-amber-200 rounded-lg text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                                                rows={3}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button onClick={() => setIsEditingBio(false)} className="text-xs text-gray-500">Cancelar</button>
                                                <button onClick={handleSaveBio} className="text-xs bg-amber-600 text-white px-3 py-1 rounded-full">Guardar</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {description || "¡Hola! Soy un apasionado del café. Me encanta explorar nuevos orígenes y métodos de preparación. Aprendiendo cada día más en BaristaFlow."}
                                        </p>
                                    )}
                                </div>

                                <div className="w-full space-y-3">
                                    {userRole === 'normal' && (
                                        <button
                                            onClick={() => navigate('/educator-apply')}
                                            className="w-full py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        >
                                            <FaGraduationCap /> Convertirme en Educador
                                        </button>
                                    )}
                                    <button className="w-full py-3 bg-white border border-amber-200 text-amber-800 rounded-xl font-semibold hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                                        <FaCog /> Configuración
                                    </button>
                                    <button
                                        onClick={logout}
                                        className="w-full py-3 bg-white border border-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaSignOutAlt /> Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido Principal - Derecha */}
                    <div className="lg:w-2/3 space-y-8">

                        {/* Sección Mis Cursos */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
                            <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                                <FaBookOpen className="text-amber-600" /> Mis Cursos Activos
                            </h2>
                            <MyCoursesSection />
                        </div>

                        {/* Sección Mis Publicaciones (NUEVA) */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
                            <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                                <FaEdit className="text-amber-600" /> Mis Publicaciones
                            </h2>
                            <MyBlogsSection />
                        </div>

                    </div>
                </div>
            </div>
            {/* Footer eliminado para evitar duplicados */}
        </div>
    );
};

export default ProfilePage;