// baristaflow-api/src/products.ts

// 🚨 Dejamos la interfaz SÓLO para el tipado interno de TypeScript
export interface Product {
    id: number;
    name: string;
    image: string;
    price: string;
    description: string;
    category: 'grano' | 'cafeteras' | 'maquinas' | 'molinos' | 'accesorios';
}

// 🚨 Quitamos 'export const' y definimos la constante normalmente
const products: Product[] = [
    {
        id: 101,
        name: 'Café de Origen Único Etiopía',
        image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQzKD3nBlPRz3wI9z0pOAypH1w7Z6rwBKc1PWSnEb9bZOrCPXYwJHjGdP1L-73KAR9wqJovtoqsXOcnhpols7BdvQjcJ-xSK3oj3oRsFnuQ',
        price: '18.99',
        description: 'Bolsa de 300g con notas florales, acidez cítrica y cuerpo ligero. Tueste medio.',
        category: 'grano',
    },
    {
        id: 102,
        name: 'Prensa Francesa Clásica (1L)',
        image: 'https://images.unsplash.com/photo-1708127368781-cd5f069a90a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
        price: '34.50',
        description: 'Ideal para inmersión. Vidrio borosilicato y marco de acero inoxidable.',
        category: 'cafeteras',
    },
    {
        id: 103,
        name: 'Máquina Espresso Portátil Wacaco',
        image: 'https://ae-pic-a1.aliexpress-media.com/kf/S963599af4b8746b4a5f9792781d82c0bA.jpg_640x640q75.jpg_.avif',
        price: '69.00',
        description: 'Perfecta para viajes. Espresso con 8 bares de presión manual.',
        category: 'maquinas',
    },
    {
        id: 104,
        name: 'Molino Manual Cónico (Acero)',
        image: 'https://ae-pic-a1.aliexpress-media.com/kf/S43492f3905294fee9f067da86e5e07f0f.jpg_640x640q75.jpg_.avif',
        price: '49.99',
        description: 'Muelas de cerámica ajustables para molienda fina a gruesa. Diseño robusto.',
        category: 'molinos',
    },
    {
        id: 105,
        name: 'V60 Dripper (Cerámica)',
        image: 'https://ae-pic-a1.aliexpress-media.com/kf/S28b43a1511bc4468861600ecdffa7ca5f.jpg_960x960q75.jpg_.avif',
        price: '24.00',
        description: 'Método de filtrado rápido y limpio. Resalta las notas de los cafés claros.',
        category: 'accesorios',
    },
];

// 🚨 EXPORTACIÓN FINAL EN SINTAXIS COMMONJS
module.exports = { products };