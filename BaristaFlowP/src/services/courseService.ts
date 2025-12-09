import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Definición de la interfaz Course
export interface Course {
    id: string;
    title: string;
    description: string;
    price: string;
    duration: string;
    level: 'Básico' | 'Intermedio' | 'Avanzado';
    image: string;
    authorId: string;
    authorName: string;
    createdAt?: number;
    htmlContent?: string; // Contenido HTML personalizado
    blocks?: any[]; // NEW: Structured content blocks
}

const API_URL = `${API_BASE_URL}/api/courses`;

export const courseService = {
    // 1. Crear Curso
    createCourse: async (courseData: Omit<Course, 'id' | 'createdAt'>) => {
        try {
            const response = await axios.post(API_URL, courseData);
            return response.data;
        } catch (error) {
            console.error("Error creating course:", error);
            throw error;
        }
    },

    // 2. Obtener todos los cursos
    getAllCourses: async (): Promise<Course[]> => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching courses:", error);
            return [];
        }
    },

    // 3. Obtener cursos por autor (Educador)
    getCoursesByAuthor: async (authorId: string): Promise<Course[]> => {
        try {
            // Enviamos el authorId como query param
            const response = await axios.get(`${API_URL}?authorId=${authorId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching author courses:", error);
            return [];
        }
    },

    // 4. Obtener un curso por ID
    getCourseById: async (courseId: string): Promise<Course | null> => {
        try {
            const response = await axios.get(`${API_URL}/${courseId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching course by ID:", error);
            return null;
        }
    },

    // 5. Actualizar Curso
    updateCourse: async (courseId: string, updates: Partial<Course>) => {
        try {
            await axios.put(`${API_URL}/${courseId}`, updates);
        } catch (error) {
            console.error("Error updating course:", error);
            throw error;
        }
    },

    // 6. Eliminar Curso
    deleteCourse: async (courseId: string) => {
        try {
            await axios.delete(`${API_URL}/${courseId}`);
        } catch (error) {
            console.error("Error deleting course:", error);
            throw error;
        }
    }
};
