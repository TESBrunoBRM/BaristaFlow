import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';

const CreateBlogPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            const fetchBlog = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
                    const blog = response.data;
                    setTitle(blog.title);
                    setContent(blog.content);
                    setHtmlContent(blog.htmlContent || '');
                    setImageUrl(blog.imageUrl);
                } catch (error) {
                    console.error("Error fetching blog for edit:", error);
                    alert("Error al cargar el blog para editar.");
                }
            };
            fetchBlog();
        }
    }, [id, isEditing]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simulación de subida de imagen
            const fakeUrl = URL.createObjectURL(file);
            setImageUrl(fakeUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Debes iniciar sesión para publicar.");
            return;
        }

        setLoading(true);
        try {
            const blogData = {
                title,
                content,
                htmlContent,
                imageUrl,
                authorId: user.uid,
                username: user.displayName || user.email?.split('@')[0] || 'Usuario',
                date: new Date().toISOString().split('T')[0],
                excerpt: content.substring(0, 100) + '...'
            };

            if (isEditing) {
                await axios.put(`${API_BASE_URL}/api/blogs/${id}`, blogData);
                alert("Blog actualizado con éxito!");
            } else {
                await axios.post(`${API_BASE_URL}/api/blogs`, blogData);
                alert("Blog publicado con éxito!");
            }
            navigate('/community');
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Error al guardar el blog.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 flex flex-col font-sans">
            <div className="grow container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-4xl font-bold text-amber-900 mb-8 text-center font-serif">
                    {isEditing ? 'Editar Publicación' : 'Crear Nueva Publicación'}
                </h1>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-amber-100 space-y-6">
                    <div>
                        <label className="block text-amber-800 font-semibold mb-2">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                            placeholder="Ej: El arte del Latte Art"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-amber-800 font-semibold mb-2">Imagen de Portada</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-amber-100 file:text-amber-700
                                hover:file:bg-amber-200 transition-colors"
                            />
                            {imageUrl && (
                                <img src={imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-amber-200" />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-amber-800 font-semibold mb-2">Contenido (Texto Plano)</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-3 border border-amber-200 rounded-lg h-32 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Escribe un resumen o introducción..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-amber-800 font-semibold mb-2">Contenido HTML (Opcional - Para incrustar videos/imágenes)</label>
                        <textarea
                            value={htmlContent}
                            onChange={(e) => setHtmlContent(e.target.value)}
                            className="w-full p-3 border border-amber-200 rounded-lg h-48 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                            placeholder="<p>Tu contenido HTML aquí...</p>"
                        />
                        <p className="text-xs text-gray-500 mt-1">Puedes usar etiquetas HTML básicas.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg shadow-lg transform transition-all hover:-translate-y-1 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'}`}
                    >
                        {loading ? (isEditing ? 'Actualizando...' : 'Publicando...') : (isEditing ? 'Guardar Cambios' : 'Publicar Post')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateBlogPage;