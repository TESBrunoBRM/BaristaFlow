// src/components/LatestReviewsSection.tsx
import React from 'react';
import ReviewCard from './ReviewCard';
import type { Review } from '../types/review';

// Datos de ejemplo para las reseñas
const reviewsData: Review[] = [
  {
    title: 'Review title',
    body: 'Review body text...',
    reviewerName: 'Reviewer name',
    date: 'Date',
    rating: 5,
  },
  {
    title: 'Review title',
    body: 'Review body text...',
    reviewerName: 'Reviewer name',
    date: 'Date',
    rating: 4,
  },
  {
    title: 'Review title',
    body: 'Review body text...',
    reviewerName: 'Reviewer name',
    date: 'Date',
    rating: 5,
  },
];

const LatestReviewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-[#3A1F18] mb-10 text-center">
          Latest reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsData.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestReviewsSection;