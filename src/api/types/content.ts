export enum ContentType {
  Banner = 'banner',
  Promotion = 'promotion',
  Page = 'page',
  Blog = 'blog'
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: ContentType;
  is_published: boolean;
  featured_image?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface ContentFormValues {
  title: string;
  slug: string;
  content: string;
  type: ContentType;
  is_published: boolean;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
}
