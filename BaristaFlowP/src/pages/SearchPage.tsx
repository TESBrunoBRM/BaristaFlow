import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaBox, FaBook, FaNewspaper, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { courseService } from '../services/courseService';

interface SearchResult {
    id: string;
    title: string; // Name for users/products, Title for blogs/courses
    description?: string;
    image?: string;
    type: 'user' | 'blog' | 'product' | 'course';
    link: string;
}

const SearchPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'users' | 'blogs' | 'products' | 'courses'>('all');

    useEffect(() => {
        if (initialQuery) {
            handleSearch(initialQuery);
        }
    }, [initialQuery]);

    const handleSearch = async (term: string) => {
        if (!term.trim()) return;
        setLoading(true);
        setResults([]);

        const lowerTerm = term.toLowerCase();
        const allResults: SearchResult[] = [];

        try {
            // 1. Search Users (Firebase)
            const usersRef = ref(database, 'users');
            const usersSnapshot = await get(usersRef);
            if (usersSnapshot.exists()) {
                usersSnapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    const username = user.username || user.displayName || '';
                    if (username.toLowerCase().includes(lowerTerm)) {
                        allResults.push({
                            id: childSnapshot.key!,
                            title: username,
                            description: user.description || 'Usuario de BaristaFlow',
                            image: user.photoURL || 'https://via.placeholder.com/150',
                            type: 'user',
                            link: `/profile/${childSnapshot.key}` // Note: Profile viewing of others might need implementation
                        });
                    }
                });
            }

            // 2. Search Blogs (API)
            const blogsResponse = await axios.get('http://localhost:3000/api/blogs');
            const blogs = blogsResponse.data;
            blogs.forEach((blog: any) => {
                if (blog.title.toLowerCase().includes(lowerTerm) || blog.content?.toLowerCase().includes(lowerTerm)) {
                    allResults.push({
                        id: blog.id,
                        title: blog.title,
                        description: blog.excerpt,
                        image: blog.imageUrl,
                        type: 'blog',
                        link: `/community/${blog.id}`
                    });
                }
            });

            // 3. Search Products (API)
            const productsResponse = await axios.get('http://localhost:3000/api/products');
            const products = productsResponse.data;
            products.forEach((product: any) => {
                if (product.name.toLowerCase().includes(lowerTerm) || product.description.toLowerCase().includes(lowerTerm)) {
                    allResults.push({
                        id: product.id,
                        title: product.name,
                        description: product.description,
                        image: product.image,
                        type: 'product',
                        link: `/products/${product.id}` // Note: Product detail page might need check
                    });
                }
            });

            // 4. Search Courses (Service)
            const courses = await courseService.getAllCourses();
            courses.forEach((course: any) => {
                if (course.title.toLowerCase().includes(lowerTerm) || course.description.toLowerCase().includes(lowerTerm)) {
                    allResults.push({
                        id: course.id,
                        title: course.title,
                        description: course.description,
                        image: course.thumbnailUrl,
                        type: 'course',
                        link: `/courses/${course.id}`
                    });
                }
            });

            setResults(allResults);

        } catch (error) {
            console.error("Error searching:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    const filteredResults = activeTab === 'all'
        ? results
        : results.filter(r => r.type === activeTab.slice(0, -1)); // 'users' -> 'user'

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-bold text-[#3A1F18] mb-6 flex items-center gap-2">
                <FaSearch /> Resultados de Búsqueda
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleFormSubmit} className="mb-8">
                <div className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar usuarios, blogs, cursos, productos..."
                        className="w-full p-4 pl-12 rounded-full border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                    />
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition-colors font-semibold"
                    >
                        Buscar
                    </button>
                </div>
            </form>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8 overflow-x-auto pb-2">
                {[
                    { id: 'all', label: 'Todo', icon: <FaSearch /> },
                    { id: 'users', label: 'Usuarios', icon: <FaUser /> },
                    { id: 'blogs', label: 'Blogs', icon: <FaNewspaper /> },
                    { id: 'courses', label: 'Cursos', icon: <FaBook /> },
                    { id: 'products', label: 'Productos', icon: <FaBox /> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
                            }`}
                    >
                        {tab.icon} {tab.label}
                        <span className="ml-1 text-xs opacity-70 bg-black/10 px-1.5 py-0.5 rounded-full">
                            {tab.id === 'all'
                                ? results.length
                                : results.filter(r => r.type === tab.id.slice(0, -1)).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center py-20">
                    <FaSpinner className="animate-spin text-4xl text-amber-600 mx-auto mb-4" />
                    <p className="text-gray-500">Buscando...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.length > 0 ? (
                        filteredResults.map((result) => (
                            <Link
                                key={`${result.type}-${result.id}`}
                                to={result.link}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={result.image || 'https://via.placeholder.com/300'}
                                        alt={result.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white uppercase ${result.type === 'user' ? 'bg-blue-500' :
                                        result.type === 'blog' ? 'bg-green-500' :
                                            result.type === 'course' ? 'bg-purple-500' :
                                                'bg-amber-500'
                                        }`}>
                                        {result.type === 'user' ? 'Usuario' :
                                            result.type === 'blog' ? 'Blog' :
                                                result.type === 'course' ? 'Curso' :
                                                    'Producto'}
                                    </span>
                                </div>
                                <div className="p-4 grow">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">{result.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-3">{result.description}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No se encontraron resultados para "{initialQuery}".
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
