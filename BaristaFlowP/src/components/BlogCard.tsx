// src/components/BlogCard.tsx
import React from 'react';
import { FaHeart, FaComment, FaShareAlt, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface BlogCardProps {
    id: number;
    title: string;
    imageUrl: string;
    author: string;
    date: string;
    excerpt: string;
    likes: number; // Nuevo campo para simular interacción
    comments: number; // Nuevo campo para simular interacción
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, imageUrl, author, date, excerpt, likes, comments }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            
            {/* 1. Header del Post (Autor y Fecha) */}
            <div className="flex items-center p-4">
                <FaUserCircle className="text-gray-400 text-3xl mr-3" />
                <div>
                    <p className="font-bold text-[#3A1F18]">{author}</p>
                    <p className="text-xs text-gray-500">{date}</p>
                </div>
            </div>

            {/* 2. Imagen del Post (La parte más importante del "Feed") */}
            <Link to={`/community/${id}`}>
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-80 object-cover cursor-pointer" 
                />
            </Link>

            {/* 3. Barra de Interacción (Likes, Comentarios, Compartir) */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <div className="flex space-x-4 text-gray-600">
                    <button className="flex items-center hover:text-red-500 transition-colors">
                        <FaHeart className="mr-1" />
                        <span className="text-sm">{likes}</span>
                    </button>
                    <button className="flex items-center hover:text-amber-600 transition-colors">
                        <FaComment className="mr-1" />
                        <span className="text-sm">{comments}</span>
                    </button>
                    <button className="hover:text-amber-600 transition-colors">
                        <FaShareAlt />
                    </button>
                </div>
            </div>

            {/* 4. Título y Descripción (Debajo de la interacción) */}
            <div className="px-4 pb-4">
                <h3 className="text-lg font-bold text-[#3A1F18] mb-1">{title}</h3>
                <p className="text-sm text-gray-700 line-clamp-2">{excerpt}</p>
                <Link to={`/community/${id}`} className="text-xs font-semibold text-amber-600 hover:text-amber-700 mt-2 block">
                    Leer más...
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;