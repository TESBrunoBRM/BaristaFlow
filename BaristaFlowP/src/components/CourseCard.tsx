// src/components/CourseCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../services/courseService'; // Usamos el tipo del servicio

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-transform transform hover:scale-105 flex flex-col h-full">
      <Link to={`/courses/${course.id}`} className="block">
        <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-6 flex flex-col grow">
        <Link to={`/courses/${course.id}`} className="block">
          <h3 className="text-xl font-bold text-[#3A1F18] mb-1 hover:text-amber-600 transition-colors">{course.title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-4 grow">{course.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-800">Duración: {course.duration}</span>
          <span className="font-semibold text-gray-800">Nivel: {course.level}</span>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-semibold text-gray-900">{course.price}</span>
          <Link
            to={`/courses/${course.id}`}
            className="px-4 py-2 bg-amber-500 text-[#3A1F18] font-bold rounded-lg shadow-md hover:bg-amber-600 transition-colors"
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;