// src/components/BlogPostCard.tsx
import React from 'react';
import type { BlogPost } from '../types/blog';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-transform transform hover:scale-105">
      <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#3A1F18] mb-1">{post.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="font-semibold text-gray-800">Por: {post.author}</span>
          <span>{post.date}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;