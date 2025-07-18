import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DataSciencePostDB {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  status: 'planned' | 'in-progress' | 'completed';
  featured: boolean;
  created_on: string;
  updated_on: string;
  github_url?: string;
  demo_url?: string;
  dataset_url?: string;
  methodology: string[];
  results: string;
}

export interface DataScienceMediaDB {
  id: string;
  post_id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  caption?: string;
  alt?: string;
}