import { supabase } from '../lib/supabase';
import { DataSciencePost, MediaItem } from '../types/DataSciencePost';
import { SearchService } from './searchService';

// Database types that match your schema
export interface DataSciencePostDB {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  created_on: string;
  updated_on: string;
  github_url: string | null;
  demo_url: string | null;
  dataset_url: string | null;
  methodology: string[];
  results: string;
}

export interface DataScienceMediaDB {
  id: string;
  post_id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  caption: string | null;
  alt: string | null;
}

// Result wrapper for better error handling
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

// Transform database post to frontend format
const transformPostFromDB = (
  dbPost: DataSciencePostDB,
  media: DataScienceMediaDB[]
): DataSciencePost => {
  return {
    id: dbPost.id,
    title: dbPost.title,
    description: dbPost.description,
    content: dbPost.content,
    tags: dbPost.tags || [],
    status: dbPost.status,
    featured: dbPost.featured,
    createdOn: dbPost.created_on,
    updatedOn: dbPost.updated_on,
    githubUrl: dbPost.github_url || undefined,
    demoUrl: dbPost.demo_url || undefined,
    datasetUrl: dbPost.dataset_url || undefined,
    methodology: dbPost.methodology || [],
    results: dbPost.results,
    media: media.map((m) => ({
      id: m.id,
      type: m.type,
      url: m.url,
      caption: m.caption || undefined,
      alt: m.alt || undefined,
    })),
  };
};

// Transform frontend post to database format
const transformPostToDB = (
  post: DataSciencePost
): Omit<DataSciencePostDB, 'created_on' | 'updated_on'> => {
  return {
    id: post.id,
    title: post.title,
    description: post.description,
    content: post.content,
    tags: post.tags || [],
    status: post.status,
    featured: post.featured,
    github_url: post.githubUrl || null,
    demo_url: post.demoUrl || null,
    dataset_url: post.datasetUrl || null,
    methodology: post.methodology || [],
    results: post.results,
  };
};

// Generate UUID (you might want to use a proper UUID library)
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Helper function to create error result
const createErrorResult = <T>(error: any, message: string): ServiceResult<T> => {
  console.error(message, error);
  return {
    success: false,
    error: message,
    details: error
  };
};

// Helper function to create success result
const createSuccessResult = <T>(data: T): ServiceResult<T> => {
  return {
    success: true,
    data
  };
};

export class DataScienceService {
  // Fetch all posts with their media
  static async getAllPosts(): Promise<ServiceResult<DataSciencePost[]>> {
    try {
      // Fetch posts
      const { data: posts, error: postsError } = await supabase
        .from('data_science_posts')
        .select('*')
        .order('created_on', { ascending: false });

      if (postsError) {
        return createErrorResult(postsError, 'Failed to fetch posts from database');
      }

      if (!posts || posts.length === 0) {
        return createSuccessResult([]);
      }

      // Fetch all media for these posts
      const postIds = posts.map((p) => p.id);
      const { data: media, error: mediaError } = await supabase
        .from('data_science_media')
        .select('*')
        .in('post_id', postIds);

      if (mediaError) {
        return createErrorResult(mediaError, 'Failed to fetch media from database');
      }

      // Group media by post_id
      const mediaByPost = (media || []).reduce((acc, item) => {
        if (!acc[item.post_id]) acc[item.post_id] = [];
        acc[item.post_id].push(item);
        return acc;
      }, {} as Record<string, DataScienceMediaDB[]>);

      // Transform and return posts
      const transformedPosts = posts.map((post) =>
        transformPostFromDB(post, mediaByPost[post.id] || [])
      );

      return createSuccessResult(transformedPosts);
    } catch (error) {
      return createErrorResult(error, 'Unexpected error while fetching posts');
    }
  }

  // Create a new post
  static async createPost(post: DataSciencePost): Promise<ServiceResult<DataSciencePost>> {
    try {
      // Generate UUID for new post if not provided
      const postId = post.id || generateUUID();
      const postData = { ...post, id: postId };

      // Insert post
      const { data: newPost, error: postError } = await supabase
        .from('data_science_posts')
        .insert(transformPostToDB(postData))
        .select()
        .single();

      if (postError) {
        return createErrorResult(postError, 'Failed to create post in database');
      }

      // Insert media items if any
      const mediaItems: DataScienceMediaDB[] = [];
      if (post.media && post.media.length > 0) {
        const mediaToInsert = post.media.map((m) => ({
          id: m.id || generateUUID(),
          post_id: postId,
          type: m.type,
          url: m.url,
          caption: m.caption || null,
          alt: m.alt || null,
        }));

        const { data: insertedMedia, error: mediaError } = await supabase
          .from('data_science_media')
          .insert(mediaToInsert)
          .select();

        if (mediaError) {
          return createErrorResult(mediaError, 'Failed to create media items in database');
        }

        mediaItems.push(...(insertedMedia || []));
      }

      // Generate and update embedding for the new post
      await SearchService.updatePostEmbedding(postId, postData.title, postData.description);

      const result = transformPostFromDB(newPost!, mediaItems);
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(error, 'Unexpected error while creating post');
    }
  }

  // Update an existing post
  static async updatePost(post: DataSciencePost): Promise<ServiceResult<DataSciencePost>> {
    try {
      // Update post
      const { data: updatedPost, error: postError } = await supabase
        .from('data_science_posts')
        .update(transformPostToDB(post))
        .eq('id', post.id)
        .select()
        .single();

      if (postError) {
        return createErrorResult(postError, 'Failed to update post in database');
      }

      // Delete existing media
      const { error: deleteMediaError } = await supabase
        .from('data_science_media')
        .delete()
        .eq('post_id', post.id);

      if (deleteMediaError) {
        return createErrorResult(deleteMediaError, 'Failed to delete existing media');
      }

      // Insert new media items
      const mediaItems: DataScienceMediaDB[] = [];
      if (post.media && post.media.length > 0) {
        const mediaToInsert = post.media.map((m) => ({
          id: m.id || generateUUID(),
          post_id: post.id, // Fixed: was using undefined postId
          type: m.type,
          url: m.url,
          caption: m.caption || null,
          alt: m.alt || null,
        }));

        const { data: insertedMedia, error: mediaError } = await supabase
          .from('data_science_media')
          .insert(mediaToInsert)
          .select();

        if (mediaError) {
          return createErrorResult(mediaError, 'Failed to insert new media items');
        }

        mediaItems.push(...(insertedMedia || []));
      }

      // Update embedding for the updated post
      await SearchService.updatePostEmbedding(post.id, post.title, post.description);

      const result = transformPostFromDB(updatedPost!, mediaItems);
      return createSuccessResult(result);
    } catch (error) {
      return createErrorResult(error, 'Unexpected error while updating post');
    }
  }

  // Delete a post
  static async deletePost(postId: string): Promise<ServiceResult<void>> {
    try {
      // Delete media first (foreign key constraint)
      const { error: mediaError } = await supabase
        .from('data_science_media')
        .delete()
        .eq('post_id', postId);

      if (mediaError) {
        return createErrorResult(mediaError, 'Failed to delete media items');
      }

      // Delete post
      const { error: postError } = await supabase
        .from('data_science_posts')
        .delete()
        .eq('id', postId);

      if (postError) {
        return createErrorResult(postError, 'Failed to delete post');
      }

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(error, 'Unexpected error while deleting post');
    }
  }

  // Upload media file to Supabase Storage
  static async uploadMedia(
    file: File,
    postId: string
  ): Promise<ServiceResult<string>> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${postId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('data-science-media')
        .upload(fileName, file);

      if (error) {
        return createErrorResult(error, 'Failed to upload file to storage');
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from('data-science-media')
        .getPublicUrl(fileName);

      return createSuccessResult(publicUrl);
    } catch (error) {
      return createErrorResult(error, 'Unexpected error while uploading media');
    }
  }
}