// src/types/blog.ts
export type BlockType = 'text' | 'image' | 'video' | 'file' | 'link' | 'heading' | 'separator' | 'embed' | 'list' | 'quote' | 'callout';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // Text content, URL, or JSON string for complex data
  metadata?: {
    caption?: string;
    level?: 1 | 2 | 3;
    filename?: string;
    mimeType?: string;
    // Specifically for embed:
    provider?: string;
    // For lists
    listType?: 'bullet' | 'ordered';
    items?: string[];
    // For callouts
    calloutType?: 'info' | 'warning' | 'tip' | 'success';
    // For quotes
    author?: string;
  };
}

export interface BlogPost {
  id: number;
  title: string;
  imageUrl: string;
  excerpt: string;
  author: string;
  authorId?: string;
  date: string;
  content?: string; // Legacy simple content
  htmlContent?: string; // Legacy unsafe content
  blocks?: ContentBlock[]; // NEW: Structured content
}