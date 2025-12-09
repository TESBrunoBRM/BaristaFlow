import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import type { ContentBlock } from '../types/blog';
import ContentBlockEditor from '../components/editor/ContentBlockEditor';

const CreateBlogPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Resumen
    const [imageUrl, setImageUrl] = useState('');
    const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload'); // NEW: Toggle state
    // New Blocks State
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            const fetchBlog = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
                    const blog = response.data;
                    setTitle(blog.title);
                    setContent(blog.content); // Resumen
                    setImageUrl(blog.imageUrl);

                    // Load blocks if they exist
                    if (blog.blocks && Array.isArray(blog.blocks)) {
                        setBlocks(blog.blocks);
                    } else if (blog.htmlContent) {
                        // Fallback/Migration hint: user sees empty blocks but old HTML still exists in DB?
                        // Or we could create a 'text' block with the old HTML (unsafe?)
                        // Better to start fresh for safety, or let user re-create.
                        // Let's just leave blocks empty for now, user can add new content.
                    }
                } catch (error) {
                    console.error("Error fetching blog for edit:", error);
                    alert("Error al cargar el blog para editar.");
                }
            };
            fetchBlog();
        }
    }, [id, isEditing]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Show loading state (we can use the global loading or a local one if we added it)
            // For now, let's just use the fake URL for immediate feedback while uploading?
            // No, safer to wait for real URL to avoid "blob" issues if save happens too fast.
            const fakeUrl = URL.createObjectURL(file);
            setImageUrl(fakeUrl); // Optimistic update

            // Real Upload via Proxy
            const formData = new FormData();
            formData.append('file', file);

            // Using the proxy we just fixed
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setImageUrl(data.url); // Replace blob with real URL
        } catch (error) {
            console.error("Error uploading cover image:", error);
            alert("Error al subir la imagen de portada.");
            setImageUrl(''); // Revert on failure
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
                content, // This is the excerpt
                imageUrl,
                blocks, // NEW: Send blocks
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
            <div className="grow container mx-auto px-4 py-12 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-amber-900 font-serif">
                        {isEditing ? 'Editar Publicación' : 'Crear Nueva Publicación'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Metadata Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2">Información Básica</h2>
                        <div>
                            <label className="block text-amber-800 font-semibold mb-2">Título del Artículo</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-lg font-bold"
                                placeholder="Ej: El arte del Latte Art"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-amber-800 font-semibold mb-2">Imagen de Portada</label>

                            {/* Toggle Tabs */}
                            <div className="flex gap-4 mb-4 border-b border-amber-100">
                                <button
                                    type="button"
                                    onClick={() => setImageMode('upload')}
                                    className={`pb-2 px-4 font-medium transition-colors ${imageMode === 'upload' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-400 hover:text-amber-500'}`}
                                >
                                    Subir Archivo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode('url')}
                                    className={`pb-2 px-4 font-medium transition-colors ${imageMode === 'url' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-400 hover:text-amber-500'}`}
                                >
                                    Usar URL Externa
                                </button>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="flex-1">
                                    {imageMode === 'upload' ? (
                                        <div className="border-2 border-dashed border-amber-200 rounded-xl p-8 text-center hover:bg-amber-50 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="text-amber-700">
                                                <p className="font-bold">Click para subir imagen</p>
                                                <p className="text-sm opacity-70">JPG, PNG, WEBP (Max 5MB)</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="https://images.unsplash.com/photo-..."
                                            className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none font-mono text-sm text-amber-900"
                                        />
                                    )}
                                    <p className="text-xs text-gray-400 mt-2">
                                        {imageMode === 'upload'
                                            ? 'La imagen se alojará en nuestro servidor.'
                                            : 'Recomendado: Usa Unsplash, Pexels o similares para ahorrar espacio.'}
                                    </p>
                                </div>

                                {/* Preview */}
                                <div className="shrink-0">
                                    {imageUrl ? (
                                        <div className="relative group">
                                            <img
                                                src={imageUrl}
                                                alt="Preview"
                                                className="h-32 w-48 object-cover rounded-lg shadow-md border border-amber-200 bg-gray-100"
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Error+Imagen')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImageUrl('')}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Quitar imagen"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-32 w-48 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-xs text-center p-4">
                                            Sin vista previa
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-amber-800 font-semibold mb-2">Resumen / Introducción</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full p-3 border border-amber-200 rounded-lg h-24 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                                placeholder="Breve descripción que aparecerá en la lista de blogs..."
                                required
                            />
                        </div>
                    </div>

                    {/* Content Editor Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-amber-100">
                        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">Contenido del Artículo</h2>

                        <ContentBlockEditor
                            blocks={blocks}
                            onChange={setBlocks}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`py-4 px-8 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all hover:-translate-y-1 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'}`}
                        >
                            {loading ? (isEditing ? 'Guardando...' : 'Publicando...') : (isEditing ? 'Guardar Cambios' : 'Publicar Ahora')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlogPage;