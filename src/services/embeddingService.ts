// Embedding service for generating and managing text embeddings
export interface EmbeddingResult {
  embedding: number[];
  text: string;
}

export class EmbeddingService {
  // Simple text-based embedding fallback for browser environment
  private static generateSimpleEmbedding(text: string): number[] {
    // Create a simple hash-based embedding as fallback
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    
    // Simple word-based feature extraction
    words.forEach((word, index) => {
      const hash = this.simpleHash(word);
      const position = Math.abs(hash) % 384;
      embedding[position] += 1 / (index + 1); // Weight by position
    });
    
    // Normalize the vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }
    
    return embedding;
  }

  // Simple hash function for consistent word mapping
  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  // Generate embedding for a given text
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      // For now, use simple text-based embedding
      // This can be upgraded to use Supabase Edge Functions later
      return this.generateSimpleEmbedding(text);
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Fallback: return zero vector if embedding fails
      return new Array(384).fill(0);
    }
  }

  // Generate embedding for post (title + description)
  static async generatePostEmbedding(title: string, description: string): Promise<number[]> {
    const combinedText = `${title} ${description}`.trim();
    return this.generateEmbedding(combinedText);
  }

  // Calculate cosine similarity between two embeddings
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}