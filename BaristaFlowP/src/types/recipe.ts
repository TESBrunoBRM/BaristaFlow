export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  preparation: string[];
  difficulty: 'Fácil' | 'Media' | 'Difícil';
}