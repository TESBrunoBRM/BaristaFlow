// src/types/course.ts
export interface Course {
  id: string;
  title: string;
  image: string;
  description: string;
  price: string;
  duration: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
}