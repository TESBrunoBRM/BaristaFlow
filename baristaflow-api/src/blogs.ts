// baristaflow-api/src/blogs.ts

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    imageUrl: string;
    author: string;
    date: string;
    likes: number;
    comments: number;
    content?: string;
    htmlContent?: string; // Contenido HTML opcional (iframe, etc)
}

const blogs: BlogPost[] = [
    {
        id: 201,
        title: "Los 5 Errores Más Comunes al Preparar Espresso en Casa",
        excerpt: "Aprende a evitar la canalización, el sub-extracción y la sobre-extracción para un shot perfecto. Consejos de experto.",
        content: "El espresso es un arte y una ciencia. Aquí detallamos los errores más comunes...",
        imageUrl: "https://images.unsplash.com/photo-1558980182-d45084962c5b?q=80&w=2940&auto=format&fit=crop",
        author: "BaristaFlow Team",
        date: "2025-10-25",
        likes: 124,
        comments: 28
    },
    {
        id: 202,
        title: "La Magia del Tueste: ¿Qué le hace a tu grano?",
        excerpt: "Una inmersión profunda en el proceso de tueste y cómo afecta el cuerpo, la acidez y el sabor final de tu café.",
        content: "El tueste transforma el grano verde en el café aromático que amamos...",
        imageUrl: "https://images.unsplash.com/photo-1534062569502-30df2b792348?q=80&w=2940&auto=format&fit=crop",
        author: "Andrea T.",
        date: "2025-10-18",
        likes: 89,
        comments: 15
    },
];

// 🚨 EXPORTACIÓN FINAL EN SINTAXIS COMMONJS
module.exports = { blogs };