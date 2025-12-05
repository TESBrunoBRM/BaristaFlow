// baristaflow-api/src/courses.ts
import type { Request, Response } from 'express';

export interface Course {
    id: number | string;
    title: string;
    image: string;
    description: string;
    price: string;
    duration: string;
    level: 'Básico' | 'Intermedio' | 'Avanzado';
    authorId?: string;
    htmlContent?: string; // Contenido HTML personalizado (iframe)
}

// 🚨 Datos Iniciales (In-Memory Database)
let courses: Course[] = [
    {
        id: 1,
        title: 'Maestría en Prensa Francesa',
        image: 'https://images.unsplash.com/photo-1639906512494-dd4a536abc4e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Aprende a controlar el tiempo y la molienda para obtener un café con cuerpo y aceites naturales perfectos.',
        price: '19.99',
        duration: '2 semanas',
        level: 'Básico',
    },
    {
        id: 2,
        title: 'El Arte de la Moka Italiana',
        image: 'https://images.unsplash.com/photo-1613410034014-18cc91dc1e1e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Saca el máximo provecho a tu cafetera italiana. Trucos para evitar el sabor quemado y lograr un café intenso.',
        price: '24.99',
        duration: '1 semana',
        level: 'Básico',
    },
    {
        id: 3,
        title: 'Texturización de Leche en Casa',
        image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=2070&auto=format&fit=crop',
        description: 'Crea espuma de leche sedosa para capuchinos usando solo una prensa francesa o batidor, sin máquina de espresso.',
        price: '29.99',
        duration: '3 semanas',
        level: 'Intermedio',
    },
    {
        id: 4,
        title: 'Introducción al Filtrado V60',
        image: 'https://images.unsplash.com/photo-1641962710781-3df076f49e26?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Iníciate en el mundo del café de especialidad con el método de vertido. Técnica, control de temperatura y vertido.',
        price: '34.99',
        duration: '4 semanas',
        level: 'Intermedio',
    },
];

// --- CONTROLLER FUNCTIONS ---

const getCourses = (req: Request, res: Response) => {
    const authorId = req.query.authorId as string;
    if (authorId) {
        const filtered = courses.filter(c => c.authorId === authorId);
        return res.status(200).json(filtered);
    }
    res.status(200).json(courses);
};

const getCourseById = (req: Request, res: Response) => {
    const id = req.params.id;
    const course = courses.find(c => c.id == id);

    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: "Curso no encontrado" });
    }
};

const createCourse = (req: Request, res: Response) => {
    const newCourseData = req.body;

    if (!newCourseData.title || !newCourseData.price) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.warn("⚠️ Creando curso sin header de autorización (Simulación)");
    }

    const newCourse: Course = {
        id: Date.now().toString(),
        ...newCourseData
    };

    courses.push(newCourse);
    console.log("✅ Curso creado (RAM):", newCourse.title);
    res.status(201).json(newCourse);
};

const updateCourse = (req: Request, res: Response) => {
    const id = req.params.id;
    const updates = req.body;

    const index = courses.findIndex(c => c.id == id);
    if (index !== -1) {
        courses[index] = { ...courses[index], ...updates };
        console.log("✅ Curso actualizado (RAM):", id);
        res.status(200).json(courses[index]);
    } else {
        res.status(404).json({ message: "Curso no encontrado para actualizar" });
    }
};

const deleteCourse = (req: Request, res: Response) => {
    const id = req.params.id;
    const initialLength = courses.length;
    courses = courses.filter(c => c.id != id);

    if (courses.length < initialLength) {
        console.log("✅ Curso eliminado (RAM):", id);
        res.status(200).json({ success: true, message: "Curso eliminado" });
    } else {
        res.status(404).json({ message: "Curso no encontrado para eliminar" });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};