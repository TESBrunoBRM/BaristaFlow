
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
    FaCheck,
    FaShoppingBag
} from 'react-icons/fa';
import { database } from '../firebase';
import { ref, onValue, update } from 'firebase/database';
// import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // REMOVED
// import { updateProfile } from 'firebase/auth'; // REMOVED: Unused
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import type { BlogPost } from '../types/blog';
import { API_BASE_URL } from '../config/api';

interface UserStats {
    followers: number;
    following: number;
    coursesEnrolled: number;
}

// Helper to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const MyOrdersSection: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const ordersRef = ref(database, `orders/${user.uid}`);

        const unsubscribe = onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert object to array and sort by date desc
                const ordersList = Object.entries(data).map(([key, value]: [string, any]) => ({
                    id: key,
                    ...value
                })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setOrders(ordersList);
            } else {
                setOrders([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) return <div className="text-center py-4"><FaSpinner className="animate-spin inline" /> Cargando pedidos...</div>;

    if (orders.length === 0) {
        return <p className="text-gray-500 text-center py-4">No has realizado ningún pedido aún.</p>;
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-gray-800">Pedido #{order.id}</h3>
                            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()} - {new Date(order.date).toLocaleTimeString()}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                            {order.status || 'Completado'}
                        </span>
                    </div>

                    <div className="space-y-2 mb-4">
                        {order.items && order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name} (x{item.quantity})</span>
                                <span className="font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Pagado</span>
                        <span className="text-xl font-bold text-[#3A1F18]">${order.total?.toLocaleString()}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const MyCoursesSection: React.FC = () => {
    // const { user } = useAuth(); // Unused for now
    const navigate = useNavigate();

    // Placeholder for courses logic
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full text-center py-8 text-gray-500">
                <p className="mb-4">No estás inscrito en ningún curso aún.</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="text-amber-600 font-semibold hover:underline text-sm"
                >
                    Explorar cursos disponibles →
                </button>
            </div>
        </div>
    );
};

const MyBlogsSection: React.FC = () => {
    const { user } = useAuth();
    const [myBlogs, setMyBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            if (!user) return;
            try {
                const response = await axios.get<BlogPost[]>(`${API_BASE_URL}/api/blogs`);
                // Filter blogs by authorId if available, or author name as fallback
                const userBlogs = response.data.filter(blog =>
                    (blog.authorId && blog.authorId === user.uid) ||
                    (!blog.authorId && blog.author === user.displayName)
                );
                setMyBlogs(userBlogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [user]);

    const handleDelete = async (blogId: number) => {
        const idToDelete = blogId; // Capture value
        console.log(`[DEBUG] Attempting to delete blog with ID: ${idToDelete} (Type: ${typeof idToDelete})`);

        if (window.confirm(`DEBUG: ¿Eliminar blog ID: ${idToDelete}?`)) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/api/blogs/${idToDelete}`);
                console.log("[DEBUG] Delete success:", response);
                setMyBlogs(prev => prev.filter(b => b.id !== idToDelete));
                alert("Eliminado correctamente.");
            } catch (error: any) {
                console.error("Error deleting blog - Full Error:", error);

                let debugMsg = "Error desconocido";
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    debugMsg = `Server Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
                } else if (error.request) {
                    // The request was made but no response was received
                    debugMsg = "Network/CORS Error: No response received from server.";
                } else {
                    // Something happened in setting up the request that triggered an Error
                    debugMsg = `Request Setup Error: ${error.message}`;
                }

                alert(`Falló la eliminación:\n\nID: ${idToDelete}\nTipo: ${typeof idToDelete}\n\nDetalle: ${debugMsg}`);
            }
        }
    };

    if (loading) return <div className="text-center py-4"><FaSpinner className="animate-spin inline" /> Cargando publicaciones...</div>;

    if (myBlogs.length === 0) {
        return <p className="text-gray-500 text-center py-4">No has publicado ningún blog aún.</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {myBlogs.map(blog => (
                <div key={blog.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-amber-900">{blog.title}</h3>
                        <p className="text-xs text-gray-500">{blog.date}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to={`/community/${blog.id}`} className="text-amber-600 hover:text-amber-700 text-sm font-semibold">
                            Ver
                        </Link>
                        <Link to={`/edit-blog/${blog.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                            Editar
                        </Link>
                        <button
                            onClick={() => handleDelete(blog.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

import { useParams } from 'react-router-dom';

// ... imports ...

const ProfilePage: React.FC = () => {
    const { user, logout, userRole } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Get ID from URL

    // Determine which user profile to show
    const targetUserId = id || user?.uid;
    const isOwnProfile = user && user.uid === targetUserId;

    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [stats, setStats] = useState<UserStats>({ followers: 0, following: 0, coursesEnrolled: 0 });
    const [photoURL, setPhotoURL] = useState('');

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [newName, setNewName] = useState('');
    const [bio, setBio] = useState('');

    const [loadingData, setLoadingData] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!targetUserId) return;

        const userRef = ref(database, 'users/' + targetUserId);

        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setStats({
                    followers: data.followers ? Object.keys(data.followers).length : 0,
                    following: data.following ? Object.keys(data.following).length : 0,
                    coursesEnrolled: data.coursesEnrolled || 0,
                });
                setDisplayName(data.username || 'Usuario BaristaFlow');
                setDescription(data.description || '¡Hola! Me encanta el café.');
                setPhotoURL(data.photoURL || '');

                // Only update edit states if it's own profile
                if (isOwnProfile) {
                    setNewName(data.username || user?.displayName || 'Usuario BaristaFlow');
                    setBio(data.description || '¡Hola! Me encanta el café.');
                }
            } else {
                // Fallback or empty state
                setDisplayName('Usuario BaristaFlow');
                setDescription('¡Hola! Me encanta el café.');
            }
            setLoadingData(false);
        }, (error) => {
            console.error("Error al leer datos de Realtime Database:", error);
            setLoadingData(false);
        });

        return () => unsubscribe();
    }, [targetUserId, isOwnProfile, user]);

    // ... handlers (handleSaveName, handleSaveBio, handleFileChange) ...
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
            alert(`El archivo es demasiado grande. Máximo permitido: ${MAX_SIZE_MB} MB.`);
            return;
        }

        setUploading(true);
        try {
            // Convert to Base64
            const base64String = await fileToBase64(file);

            // Update Realtime Database ONLY
            const userDbRef = ref(database, 'users/' + user.uid);
            await update(userDbRef, { photoURL: base64String });

            alert('Foto de perfil actualizada con éxito.');
        } catch (error) {
            console.error('Error al subir la foto:', error);
            alert('Error al subir la imagen. Intenta de nuevo.');
        } finally {
            setUploading(false);
        }
    };

    if (!targetUserId || loadingData) {
        return <div className="text-center py-20 text-xl text-gray-500"><FaSpinner className="inline animate-spin mr-2" /> Cargando perfil...</div>;
    }

    return (
        <div className="min-h-screen bg-amber-50 font-sans">
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
                                    {isOwnProfile && (
                                        <input
                                            type="file"
                                            id="photoUpload"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                    )}
                                    <div className="relative">
                                        <img
                                            src={photoURL || user?.photoURL || "https://via.placeholder.com/150"}
                                            alt="Profile"
                                            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                                        />
                                        {isOwnProfile && (
                                            <label htmlFor="photoUpload" className="absolute bottom-4 right-4 bg-amber-600 p-2 rounded-full text-white shadow-md hover:bg-amber-700 transition-colors cursor-pointer">
                                                {uploading ? <FaSpinner className="animate-spin" /> : <FaCamera size={16} />}
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {isEditingName && isOwnProfile ? (
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
                                        {isOwnProfile && (
                                            <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-amber-600 text-sm"><FaEdit /></button>
                                        )}
                                    </h1>
                                )}

                                {/* Email only visible if own profile */}
                                {isOwnProfile && <p className="text-gray-500 mb-6">{user?.email}</p>}

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
                                        {isOwnProfile && !isEditingBio && (
                                            <button onClick={() => setIsEditingBio(true)} className="text-xs text-amber-600 hover:underline">Editar</button>
                                        )}
                                    </div>
                                    {isEditingBio && isOwnProfile ? (
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
                                            {description}
                                        </p>
                                    )}
                                </div>

                                {isOwnProfile && (
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
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contenido Principal - Derecha */}
                    <div className="lg:w-2/3 space-y-8">

                        {/* Sección Mis Pedidos (Solo visible para el dueño) */}
                        {isOwnProfile && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
                                <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                                    <FaShoppingBag className="text-amber-600" /> Mis Pedidos
                                </h2>
                                <MyOrdersSection />
                            </div>
                        )}

                        {/* Sección Mis Cursos (Visible para todos, pero lógica podría variar) */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
                            <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                                <FaBookOpen className="text-amber-600" /> {isOwnProfile ? 'Mis Cursos Activos' : 'Cursos'}
                            </h2>
                            {/* TODO: Pass targetUserId to MyCoursesSection to show their courses if public */}
                            <MyCoursesSection />
                        </div>

                        {/* Sección Mis Publicaciones */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100">
                            <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                                <FaEdit className="text-amber-600" /> {isOwnProfile ? 'Mis Publicaciones' : 'Publicaciones'}
                            </h2>
                            {/* TODO: Pass targetUserId to MyBlogsSection */}
                            <MyBlogsSection />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
