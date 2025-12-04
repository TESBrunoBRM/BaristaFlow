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
        image: 'https://images.unsplash.com/photo-1518832549298-5c4d37149a46?q=80&w=2940&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1606798020811-1c5c56d787d5?q=80&w=2940&auto=format&fit=crop',
        price: '69.00',
        description: 'Perfecta para viajes. Espresso con 8 bares de presión manual.',
        category: 'maquinas',
    },
    {
        id: 104,
        name: 'Molino Manual Cónico (Acero)',
        image: 'https://images.unsplash.com/photo-1549444558-8686616086f6?q=80&w=2940&auto=format&fit=crop',
        price: '49.99',
        description: 'Muelas de cerámica ajustables para molienda fina a gruesa. Diseño robusto.',
        category: 'molinos',
    },
    {
        id: 105,
        name: 'V60 Dripper (Cerámica)',
        image: 'https://images.unsplash.com/photo-1587784013446-be11df42a178?q=80&w=2940&auto=format&fit=crop',
        price: '24.00',
        description: 'Método de filtrado rápido y limpio. Resalta las notas de los cafés claros.',
        category: 'accesorios',
    },
];

// 🚨 EXPORTACIÓN FINAL EN SINTAXIS COMMONJS
module.exports = { products };