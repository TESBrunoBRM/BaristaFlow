// src/data/recipes.ts

export interface Recipe {
  id: string;
  title: string;
  method: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  prepTime: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  videoUrl?: string; // 🚨 Nuevo campo opcional para video
}

export const recipes: Recipe[] = [
  {
    id: 'prensa-francesa-clasico',
    title: 'Prensa Francesa Clásico',
    method: 'Inmersión',
    difficulty: 'Fácil',
    prepTime: '4 min',
    image: 'https://images.unsplash.com/photo-1639906512494-dd4a536abc4e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    description: 'La forma más sencilla de obtener una taza de café robusta y de cuerpo completo. Requiere una molienda gruesa y un tiempo de inmersión preciso.',
    ingredients: [
      '30g de café (molienda gruesa)',
      '450g de agua (93°C / 200°F)',
    ],
    instructions: [
      'Calienta la prensa francesa con un poco de agua caliente y luego deséchala.',
      'Añade el café molido al fondo de la prensa.',
      'Inicia un temporizador y vierte el doble de agua (60g) sobre el café para una pre-infusión de 30 segundos (Blooming).',
      'Vierte el resto del agua (390g) en un movimiento circular y suave.',
      'Coloca la tapa con el émbolo levantado y espera 4 minutos.',
      'Presiona suavemente el émbolo hasta el fondo. Sirve inmediatamente para detener la extracción.',
    ],
    videoUrl: 'https://www.youtube.com/embed/st571DYYTR8', // James Hoffmann French Press
  },
  {
    id: 'v60-filtrado-brillante',
    title: 'V60 Filtrado Brillante',
    method: 'Filtrado',
    difficulty: 'Media',
    prepTime: '3 min 30 s',
    image: 'https://plus.unsplash.com/premium_photo-1674931348683-c4a3987438db?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    description: 'Este método resalta las notas ácidas y florales del café, ofreciendo una taza limpia y compleja. Es ideal para granos de tueste claro.',
    ingredients: [
      '20g de café (molienda media-fina)',
      '320g de agua (96°C / 205°F)',
      'Filtro de papel V60',
    ],
    instructions: [
      'Coloca el filtro en el V60 y enjuágalo completamente con agua caliente. Desecha el agua.',
      'Añade el café y nivélalo golpeando suavemente el V60.',
      'Vierte 40g de agua para la pre-infusión (Blooming) y espera 45 segundos.',
      'En la segunda fase, vierte hasta 160g de agua (120g adicionales) en el centro.',
      'En la tercera fase (a 1:30 min), vierte el resto del agua hasta los 320g.',
      'El tiempo total de goteo debe ser entre 3:00 y 3:30 minutos. Sirve y disfruta.',
    ],
    videoUrl: 'https://www.youtube.com/embed/AI4ynXzkSQo', // James Hoffmann V60
  },
  {
    id: 'capuchino-casero-prensa',
    title: 'Capuchino Casero (con Prensa Francesa)',
    method: 'Texturizado Manual',
    difficulty: 'Media',
    prepTime: '10 min',
    image: 'https://images.unsplash.com/photo-1659380803996-9380d5ddd0f9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    description: 'Combina el concentrado de Moka con leche texturizada, usando la prensa francesa para crear la espuma perfecta para un capuchino.',
    ingredients: [
      'Doble shot de Moka (Paso 1)',
      '150ml de leche fresca (entera o avena)',
      'Prensa Francesa limpia',
    ],
    instructions: [
      'Prepara el concentrado de café usando la receta Moka (Paso 1).',
      'Calienta la leche a 60°C (sin que hierva) en una olla. Viértela en la Prensa Francesa limpia.',
      'Coloca la tapa y bombea el émbolo vigorosamente unas 20-30 veces, hasta que el volumen de la leche se duplique y tenga una microespuma fina.',
      'Golpea la base de la prensa suavemente contra la mesa para eliminar las burbujas grandes.',
      'Vierte el café Moka en una taza y luego añade la leche texturizada. Usa una cuchara para sostener la espuma al verter, si es necesario.',
    ],
  },
  {
    id: 'aeropress-invertido',
    title: 'Aeropress Método Invertido',
    method: 'Inmersión / Presión',
    difficulty: 'Fácil',
    prepTime: '2 min',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop',
    description: 'El método invertido evita que el café gotee antes de tiempo, permitiendo una inmersión completa y un sabor más intenso.',
    ingredients: [
      '15g de café (molienda media)',
      '240g de agua (90°C)',
      'Aeropress y filtro de papel',
    ],
    instructions: [
      'Coloca el émbolo en la cámara del Aeropress y ponlo boca abajo (invertido).',
      'Añade el café molido y vierte el agua caliente.',
      'Remueve suavemente y deja infusionar por 1:30 minutos.',
      'Coloca el filtro en la tapa, enjuágalo y enrosca la tapa.',
      'Voltea el Aeropress sobre tu taza y presiona suavemente durante 30 segundos.',
    ],
    videoUrl: 'https://www.youtube.com/embed/j6VlT_jUVPc', // James Hoffmann Aeropress
  },
  {
    id: 'chemex-elegante',
    title: 'Chemex Clásica',
    method: 'Filtrado',
    difficulty: 'Difícil',
    prepTime: '5 min',
    image: 'https://images.unsplash.com/photo-1565404712759-854d786c28f1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'La Chemex produce un café increíblemente limpio y brillante gracias a sus filtros gruesos. Ideal para compartir.',
    ingredients: [
      '40g de café (molienda media-gruesa)',
      '600g de agua (94°C)',
      'Filtro Chemex',
    ],
    instructions: [
      'Coloca el filtro con la parte triple hacia el pico. Enjuaga con abundante agua caliente.',
      'Añade el café y haz un hueco en el centro.',
      'Blooming: Vierte 80g de agua y espera 45s.',
      'Vierte el agua en círculos concéntricos lentos, manteniendo el nivel constante.',
      'El tiempo total debe ser de unos 4 a 5 minutos. Retira el filtro y sirve.',
    ],
    videoUrl: 'https://www.youtube.com/embed/rU3cAt0M33A?si=xd3hwaUzbniSzlDk', // James Hoffmann Chemex
  },
];