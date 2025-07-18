export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  caption?: string;
  alt?: string;
}

export interface DataSciencePost {
  id: string;
  title: string;
  description: string;
  content: string; // Rich markdown with embedded media
  media: MediaItem[];
  tags: string[];
  createdOn: string;
  updatedOn: string;
  githubUrl?: string;
  demoUrl?: string;
  datasetUrl?: string;
  featured: boolean;
  methodology: string[];
  results: string;
  status: 'completed' | 'in-progress' | 'planned';
}