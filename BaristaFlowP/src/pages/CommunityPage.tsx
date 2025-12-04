import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaPlusCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    imageUrl: string;
    author: string;
    date: string;
    likes: number;
    comments: number;
}

const CommunityPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE_URL}/api/blogs`);

                if (!response.ok) {
                    throw new Error(`El servidor respondió con un error ${response.status}.`);
                }

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error('Respuesta inválida del servidor (no es JSON).');
                }

                const data = await response.json();
                setPosts(data);
            } catch (err: unknown) {
                console.error("Error al cargar los blogs:", err);
                setError(`Error de conexión: El servidor de API (${API_BASE_URL}) no respondió o el endpoint /api/blogs falló.`);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleUploadBlog = () => {
        if (user) {
            navigate('/create-blog');
        } else {
            alert('Debes iniciar sesión para subir un blog.');
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-lg text-gray-700">
                <FaSpinner className="inline animate-spin mr-2" /> Cargando el feed de la comunidad...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-xl text-red-600">
                ⚠️ Error de Conexión: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 relative">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-extrabold text-[#3A1F18]">Comunidad BaristaFlow</h1>
                <button
                    onClick={handleUploadBlog}
                    className="flex items-center px-6 py-3 bg-amber-500 text-white font-bold rounded-full shadow-lg hover:bg-amber-600 transition-all transform hover:-translate-y-1"
                >
                    <FaPlusCircle className="mr-2 text-xl" /> Crear Nuevo Post
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        to={`/community/${post.id}`}
                        key={post.id}
                        className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden h-full"
                    >
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-5">
                            <h2 className="text-xl font-bold text-[#3A1F18] mb-2">{post.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                            <div className="mt-4 text-xs text-gray-500 flex justify-between items-center">
                                <span>Por {post.author}</span>
                                <span>{post.date}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {posts.length === 0 && !loading && (
                <p className="text-center text-gray-500 mt-10">Aún no hay artículos publicados. ¡Sé el primero!</p>
            )}
        </div>
    );
};

export default CommunityPage;