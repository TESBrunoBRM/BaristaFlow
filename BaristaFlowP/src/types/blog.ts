// src/types/blog.ts
export interface BlogPost {
  id: number;
  title: string;
  imageUrl: string;
  excerpt: string;
  author: string;
  authorId?: string;
  date: string;
  content?: string;
  htmlContent?: string;
}