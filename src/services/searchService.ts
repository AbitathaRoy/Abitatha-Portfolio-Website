import { supabase } from '../lib/supabase';
import { DataSciencePost } from '../types/DataSciencePost';
import { DataScienceService } from './dataScienceService';
import { EmbeddingService } from './embeddingService';

export interface SearchResult {
  post: DataSciencePost;
  similarity?: number;
  matchType: 'semantic' | 'text' | 'exact';
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  includeContent?: boolean;
  filters?: {
    status?: string[];
    tags?: string[];
    featured?: boolean;
  };
}

export class SearchService {
  // Perform semantic search using embeddings
  static async semanticSearch(
    query: string, 
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 10, threshold = 0.3 } = options;
      
      // Generate embedding for search query
      const queryEmbedding = await EmbeddingService.generateEmbedding(query);
      
      // Build the SQL query with filters
      let sqlQuery = supabase
        .from('data_science_posts')
        .select('*')
        .not('embedding', 'is', null);

      // Apply filters
      if (options.filters?.status) {
        sqlQuery = sqlQuery.in('status', options.filters.status);
      }
      if (options.filters?.featured !== undefined) {
        sqlQuery = sqlQuery.eq('featured', options.filters.featured);
      }
      if (options.filters?.tags && options.filters.tags.length > 0) {
        sqlQuery = sqlQuery.overlaps('tags', options.filters.tags);
      }

      const { data: posts, error } = await sqlQuery;

      if (error) {
        console.error('Error in semantic search:', error);
        return [];
      }

      if (!posts || posts.length === 0) {
        return [];
      }

      // Calculate similarities and sort
      const results: SearchResult[] = [];
      
      for (const post of posts) {
        if (post.embedding) {
          const similarity = EmbeddingService.cosineSimilarity(
            queryEmbedding,
            post.embedding
          );
          
          if (similarity >= threshold) {
            // Get media for the post
            const { data: media } = await supabase
              .from('data_science_media')
              .select('*')
              .eq('post_id', post.id);

            const transformedPost: DataSciencePost = {
              id: post.id,
              title: post.title,
              description: post.description,
              content: post.content,
              tags: post.tags || [],
              status: post.status,
              featured: post.featured,
              createdOn: post.created_on,
              updatedOn: post.updated_on,
              githubUrl: post.github_url || undefined,
              demoUrl: post.demo_url || undefined,
              datasetUrl: post.dataset_url || undefined,
              methodology: post.methodology || [],
              results: post.results,
              media: (media || []).map(m => ({
                id: m.id,
                type: m.type,
                url: m.url,
                caption: m.caption || undefined,
                alt: m.alt || undefined,
              })),
            };

            results.push({
              post: transformedPost,
              similarity,
              matchType: 'semantic'
            });
          }
        }
      }

      // Sort by similarity and limit results
      return results
        .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
        .slice(0, limit);

    } catch (error) {
      console.error('Error in semantic search:', error);
      return [];
    }
  }

  // Perform text-based search (fallback)
  static async textSearch(
    query: string, 
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { limit = 10 } = options;
      const searchTerm = `%${query.toLowerCase()}%`;

      let sqlQuery = supabase
        .from('data_science_posts')
        .select('*')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);

      // Apply filters
      if (options.filters?.status) {
        sqlQuery = sqlQuery.in('status', options.filters.status);
      }
      if (options.filters?.featured !== undefined) {
        sqlQuery = sqlQuery.eq('featured', options.filters.featured);
      }
      if (options.filters?.tags && options.filters.tags.length > 0) {
        sqlQuery = sqlQuery.overlaps('tags', options.filters.tags);
      }

      const { data: posts, error } = await sqlQuery.limit(limit);

      if (error) {
        console.error('Error in text search:', error);
        return [];
      }

      if (!posts || posts.length === 0) {
        return [];
      }

      const results: SearchResult[] = [];

      for (const post of posts) {
        // Get media for the post
        const { data: media } = await supabase
          .from('data_science_media')
          .select('*')
          .eq('post_id', post.id);

        const transformedPost: DataSciencePost = {
          id: post.id,
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags || [],
          status: post.status,
          featured: post.featured,
          createdOn: post.created_on,
          updatedOn: post.updated_on,
          githubUrl: post.github_url || undefined,
          demoUrl: post.demo_url || undefined,
          datasetUrl: post.dataset_url || undefined,
          methodology: post.methodology || [],
          results: post.results,
          media: (media || []).map(m => ({
            id: m.id,
            type: m.type,
            url: m.url,
            caption: m.caption || undefined,
            alt: m.alt || undefined,
          })),
        };

        // Determine match type
        const titleMatch = post.title.toLowerCase().includes(query.toLowerCase());
        const matchType = titleMatch ? 'exact' : 'text';

        results.push({
          post: transformedPost,
          matchType: matchType as 'exact' | 'text'
        });
      }

      return results;

    } catch (error) {
      console.error('Error in text search:', error);
      return [];
    }
  }

  // Hybrid search: combines semantic and text search
  static async hybridSearch(
    query: string, 
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const [semanticResults, textResults] = await Promise.all([
        this.semanticSearch(query, { ...options, limit: options.limit || 5 }),
        this.textSearch(query, { ...options, limit: options.limit || 5 })
      ]);

      // Combine and deduplicate results
      const combinedResults = new Map<string, SearchResult>();

      // Add semantic results (higher priority)
      semanticResults.forEach(result => {
        combinedResults.set(result.post.id, result);
      });

      // Add text results if not already present
      textResults.forEach(result => {
        if (!combinedResults.has(result.post.id)) {
          combinedResults.set(result.post.id, result);
        }
      });

      // Sort by relevance (semantic similarity first, then exact matches)
      const sortedResults = Array.from(combinedResults.values()).sort((a, b) => {
        if (a.matchType === 'semantic' && b.matchType !== 'semantic') return -1;
        if (b.matchType === 'semantic' && a.matchType !== 'semantic') return 1;
        if (a.matchType === 'exact' && b.matchType === 'text') return -1;
        if (b.matchType === 'exact' && a.matchType === 'text') return 1;
        return (b.similarity || 0) - (a.similarity || 0);
      });

      return sortedResults.slice(0, options.limit || 10);

    } catch (error) {
      console.error('Error in hybrid search:', error);
      return [];
    }
  }

  // Update embeddings for a post
  static async updatePostEmbedding(postId: string, title: string, description: string): Promise<boolean> {
    try {
      const embedding = await EmbeddingService.generatePostEmbedding(title, description);
      
      const { error } = await supabase
        .from('data_science_posts')
        .update({ embedding })
        .eq('id', postId);

      if (error) {
        console.error('Error updating post embedding:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating post embedding:', error);
      return false;
    }
  }

  // Batch update embeddings for all posts
  static async updateAllEmbeddings(): Promise<void> {
    try {
      const result = await DataScienceService.getAllPosts();
      if (!result.success || !result.data) {
        console.error('Failed to fetch posts for embedding update');
        return;
      }

      const posts = result.data;
      console.log(`Updating embeddings for ${posts.length} posts...`);

      for (const post of posts) {
        await this.updatePostEmbedding(post.id, post.title, post.description);
        console.log(`Updated embedding for: ${post.title}`);
      }

      console.log('All embeddings updated successfully');
    } catch (error) {
      console.error('Error updating all embeddings:', error);
    }
  }
}