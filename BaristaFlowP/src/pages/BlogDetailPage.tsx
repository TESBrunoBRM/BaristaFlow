import React, { useEffect, useState } from 'react';
import ContentBlockRenderer from '../components/editor/ContentBlockRenderer';
import { useParams, Link } from 'react-router-dom';
import { FaUserCircle, FaArrowLeft, FaCalendarAlt, FaExclamationTriangle, FaSpinner, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { ref, get, set, remove } from 'firebase/database';
import { API_BASE_URL } from '../config/api';

// Define la interfaz para un post completo
import type { BlogPost } from '../types/blog';

const BlogDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('El artículo que buscas no existe.');
                    }
                    throw new Error(`Error del servidor: ${response.status}`);
                }

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error('Respuesta inválida del servidor (no es JSON).');
                }

                const data: BlogPost = await response.json();
                setPost(data);

                // Check if following
                if (user && data.authorId && user.uid !== data.authorId) {
                    const followingRef = ref(database, `users/${user.uid}/following/${data.authorId}`);
                    const snapshot = await get(followingRef);
                    setIsFollowing(snapshot.exists());
                }
            } catch (err: unknown) {
                console.error("Error fetching blog post:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('No se pudo cargar el artículo.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, user]);

    const handleFollowToggle = async () => {
        if (!user || !post || !post.authorId) {
            alert("Debes iniciar sesión para seguir a este autor.");
            return;
        }
        if (post.authorId === user.uid) {
            alert("No puedes seguirte a ti mismo.");
            return;
        }

        setFollowLoading(true);
        try {
            const followingRef = ref(database, `users/${user.uid}/following/${post.authorId}`);
            const followerRef = ref(database, `users/${post.authorId}/followers/${user.uid}`);

            if (isFollowing) {
                // Unfollow
                await remove(followingRef);
                await remove(followerRef);
                setIsFollowing(false);
            } else {
                // Follow
                await set(followingRef, true);
                await set(followerRef, true);
                setIsFollowing(true);

                // Create Notification for the author
                const notificationRef = ref(database, `notifications/${post.authorId}/${Date.now()}`);
                await set(notificationRef, {
                    type: 'new_follower',
                    message: `${user.displayName || 'Alguien'} ha comenzado a seguirte.`,
                    fromUserId: user.uid,
                    read: false,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
            alert("Error al actualizar seguimiento.");
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20 text-xl text-gray-500 flex flex-col items-center">
                <FaSpinner className="inline animate-spin mr-2 text-4xl mb-4" />
                Cargando artículo...
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-block p-6 bg-red-50 rounded-xl border border-red-100">
                    <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-[#3A1F18] mb-2">Lo sentimos</h2>
                    <p className="text-gray-600 mb-6">{error || "Artículo no encontrado"}</p>
                    <Link to="/community" className="px-6 py-2 bg-[#3A1F18] text-white rounded-lg hover:bg-[#523126] transition-colors">
                        Volver a la comunidad
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
            <Link to="/community" className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6 font-semibold transition-colors group">
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Volver al Blog
            </Link>

            <article className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover"
                />

                <div className="p-8 md:p-12">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <FaUserCircle className="mr-2 text-xl text-gray-400" />
                                <span className="font-semibold text-gray-700">{post.author}</span>
                            </div>

                            {/* Actions for Author */}
                            {user && post.authorId === user.uid && (
                                <div className="relative ml-auto">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                                    >
                                        <FaEllipsisV />
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
                                            <Link
                                                to={`/edit-blog/${post.id}`}
                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <FaEdit className="mr-3" /> Editar Publicación
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    setIsMenuOpen(false);
                                                    if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
                                                        try {
                                                            await fetch(`${API_BASE_URL}/api/blogs/${post.id}`, { method: 'DELETE' });
                                                            alert("Publicación eliminada.");
                                                            window.location.href = '/community';
                                                        } catch (e) {
                                                            alert("Error al eliminar.");
                                                        }
                                                    }
                                                }}
                                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <FaTrash className="mr-3" /> Eliminar Publicación
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Follow Button */}
                            {user && post.authorId && user.uid !== post.authorId && (
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={followLoading}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${isFollowing
                                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        : 'bg-amber-600 text-white hover:bg-amber-700'
                                        }`}
                                >
                                    {followLoading ? '...' : (isFollowing ? 'Siguiendo' : 'Seguir')}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            <span>{post.date}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#3A1F18] mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="prose prose-lg text-gray-700 max-w-none whitespace-pre-line mb-8">
                        {post.content}
                    </div>

                    {/* New Secure Block Renderer */}
                    {post.blocks && post.blocks.length > 0 ? (
                        <ContentBlockRenderer blocks={post.blocks} />
                    ) : post.htmlContent ? (
                        // Fallback for legacy posts
                        <div className="mt-8 border-t pt-8">
                            <h3 className="text-xl font-bold text-[#3A1F18] mb-4">Contenido Multimedia (Legacy)</h3>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-inner">
                                <iframe
                                    srcDoc={post.htmlContent}
                                    title="Contenido del Blog"
                                    className="w-full h-[400px] md:h-[500px]"
                                    sandbox="allow-scripts allow-same-origin allow-presentation"
                                    style={{ border: 'none' }}
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            </article>
        </div>
    );
};

export default BlogDetailPage;