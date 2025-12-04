export interface Product {
  id: number | string;
  name: string;
  image: string;
  price: string;
  description: string;
  category: 'grano' | 'cafeteras' | 'maquinas' | 'molinos' | 'accesorios';
}