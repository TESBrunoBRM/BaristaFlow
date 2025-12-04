// src/components/ReviewCard.tsx
import React from 'react';
import type { Review } from '../types/review';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      {/* Estrellas de la calificación (simplificado) */}
      <div className="text-yellow-400 mb-4 text-2xl">
        {'★'.repeat(review.rating)}
        {'☆'.repeat(5 - review.rating)}
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{review.title}</h4>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{review.body}</p>
      <div className="text-xs text-gray-500 font-medium">
        <p className="font-semibold text-gray-800">{review.reviewerName}</p>
        <p>{review.date}</p>
      </div>
    </div>
  );
};

export default ReviewCard;