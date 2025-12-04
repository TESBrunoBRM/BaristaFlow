import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownMenu from './DropdownMenu';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaCoffee, FaSearch } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';

interface Suggestion {
    id: string;
    title: string;
    type: 'user' | 'blog' | 'product';
    image?: string;
    link: string;
}

const Header: React.FC = () => {
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const fetchSuggestions = async (term: string) => {
        if (!term) return;
        const lowerTerm = term.toLowerCase();
        const results: Suggestion[] = [];

        try {
            // 1. Users (Firebase) - Limit to 3
            const usersRef = ref(database, 'users');
            const usersSnapshot = await get(usersRef);
            if (usersSnapshot.exists()) {
                let count = 0;
                usersSnapshot.forEach((child) => {
                    if (count >= 3) return;
                    const u = child.val();
                    const name = u.username || u.displayName || '';
                    if (name.toLowerCase().includes(lowerTerm)) {
                        results.push({
                            id: child.key!,
                            title: name,
                            type: 'user',
                            image: u.photoURL,
                            link: `/profile` // Linking to own profile for now as public profile page logic is complex
                        });
                        count++;
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
        setSuggestions(results);
    };

    // Detectar scroll para efecto glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar menú móvil al cambiar de ruta
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setSuggestions([]);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Recetas', path: '/recipes' },
        { name: 'Cursos', path: '/courses' },
        { name: 'Comunidad', path: '/community' },
        { name: 'Contacto', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
    ];

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#3A1F18]/95 backdrop-blur-md shadow-lg py-2'
                : 'bg-[#3A1F18] py-4'
                } text-white`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">

                {/* Logo y Marca */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="bg-amber-500 p-2 rounded-full text-[#3A1F18] transform group-hover:rotate-12 transition-transform duration-300">
                        <FaCoffee className="text-xl" />
                    </div>
                    <span className="text-2xl font-extrabold tracking-wider font-serif">BaristaFlow</span>
                </Link>

                {/* Navegación Desktop */}
                <nav className="hidden md:flex items-center space-x-8">
                    <ul className="flex space-x-6 items-center">
                        <li><DropdownMenu /></li>
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`text-sm font-medium hover:text-amber-400 transition-colors duration-300 relative group ${location.pathname === link.path ? 'text-amber-400' : 'text-gray-200'}`}
                                >
                                    {link.name}
                                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Acciones (Búsqueda, Carrito, Auth, Mobile Toggle) */}
                <div className="flex items-center space-x-4">

                    {/* Barra de Búsqueda (Desktop) */}
                    <div className="hidden lg:block relative group">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // @ts-ignore
                            const query = e.target.elements.search.value;
                            if (query.trim()) {
                                navigate(`/search?q=${encodeURIComponent(query)}`);
                                setSuggestions([]);
                            }
                        }}>
                            <div className="relative">
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Buscar..."
                                    autoComplete="off"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val.length > 2) {
                                            fetchSuggestions(val);
                                        } else {
                                            setSuggestions([]);
                                        }
                                    }}
                                    className="bg-white/10 border border-white/20 rounded-full py-1.5 px-4 pl-10 text-sm text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 focus:border-amber-400 transition-all w-48 focus:w-64"
                                />
                                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white">
                                    <FaSearch />
                                </button>
                            </div>
                        </form>

                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800">
                                <ul>
                                    {suggestions.map((s) => (
                                        <li key={`${s.type}-${s.id}`} className="border-b border-gray-50 last:border-0">
                                            <Link
                                                to={s.link}
                                                className="px-4 py-3 hover:bg-amber-50 transition-colors flex items-center gap-3"
                                                onClick={() => setSuggestions([])}
                                            >
                                                <img src={s.image || 'https://via.placeholder.com/40'} alt={s.title} className="w-8 h-8 rounded-full object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{s.title}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{s.type === 'user' ? 'Usuario' : s.type}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="bg-gray-50">
                                        <button
                                            onClick={() => {
                                                const input = document.querySelector('input[name="search"]') as HTMLInputElement;
                                                if (input && input.value) navigate(`/search?q=${encodeURIComponent(input.value)}`);
                                                setSuggestions([]);
                                            }}
                                            className="w-full text-center py-2 text-xs text-amber-600 font-bold hover:underline"
                                        >
                                            Ver todos los resultados
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Notificaciones */}
                    {user && <NotificationDropdown />}

                    {/* Carrito */}
                    <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors duration-300 group">
                        <FaShoppingCart className="text-xl group-hover:text-amber-400 transition-colors" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-amber-500 text-[#3A1F18] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Auth Desktop */}
                    <div className="hidden md:flex items-center space-x-3">
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-full border border-white/30 text-sm font-semibold hover:bg-white hover:text-[#3A1F18] transition-all duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-[#3A1F18] text-sm font-bold hover:from-amber-400 hover:to-amber-500 shadow-lg hover:shadow-amber-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Registrarse
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300 border border-transparent hover:border-white/30"
                                >
                                    <FaUserCircle className="text-xl text-amber-400" />
                                    <span className="text-sm font-medium max-w-[100px] truncate">{user.displayName || 'Usuario'}</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    title="Cerrar sesión"
                                    className="p-2 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors duration-300"
                                >
                                    <FaSignOutAlt />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-2xl hover:text-amber-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#3A1F18] border-t border-white/10 shadow-2xl animate-fade-in-down">
                    <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
                        <DropdownMenu />
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-lg font-medium py-2 border-b border-white/5 hover:text-amber-400 hover:pl-2 transition-all duration-300"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-4 flex flex-col space-y-3">
                            {!user ? (
                                <>
                                    <Link to="/login" className="w-full text-center py-3 rounded-lg border border-white/30 font-semibold hover:bg-white hover:text-[#3A1F18]">
                                        Iniciar Sesión
                                    </Link>
                                    <Link to="/register" className="w-full text-center py-3 rounded-lg bg-amber-500 text-[#3A1F18] font-bold hover:bg-amber-400">
                                        Registrarse
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" className="flex items-center justify-center space-x-2 py-3 rounded-lg bg-white/10">
                                        <FaUserCircle />
                                        <span>Mi Perfil</span>
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center justify-center space-x-2 py-3 rounded-lg bg-red-500/20 text-red-400">
                                        <FaSignOutAlt />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;