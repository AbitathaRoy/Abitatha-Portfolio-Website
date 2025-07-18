import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Save, Upload, Loader, Search } from 'lucide-react';
import { DataSciencePost, MediaItem } from '../types/DataSciencePost';
import { DataScienceService } from '../services/dataScienceService';
import { SearchService } from '../services/searchService';
import SearchBar from './SearchBar';

interface AdminPanelProps {
  posts: DataSciencePost[];
  onClose: () => void;
  onSave: (posts: DataSciencePost[]) => void;
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ posts, onClose, onSave, onRefresh }) => {
  const [editingPost, setEditingPost] = useState<DataSciencePost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [filteredPosts, setFilteredPosts] = useState<DataSciencePost[]>(posts);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Update filtered posts when posts prop changes
  React.useEffect(() => {
    if (!isSearchActive) {
      setFilteredPosts(posts);
    }
  }, [posts, isSearchActive]);

  const createNewPost = (): DataSciencePost => ({
    id: '',
    title: '',
    description: '',
    content: '',
    media: [],
    tags: [],
    createdOn: new Date().toISOString(),
    updatedOn: new Date().toISOString(),
    githubUrl: '',
    demoUrl: '',
    datasetUrl: '',
    featured: false,
    methodology: [],
    results: '',
    status: 'planned'
  });

  const handleCreateNew = () => {
    const newPost = createNewPost();
    setEditingPost(newPost);
    setIsCreating(true);
  };

  const handleEdit = (post: DataSciencePost) => {
    setEditingPost({ ...post });
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!editingPost) return;

    try {
      setSaving(true);
      
      if (isCreating) {
        await DataScienceService.createPost(editingPost);
      } else {
        // Update embedding when post is updated
        await SearchService.updatePostEmbedding(
          editingPost.id, 
          editingPost.title, 
          editingPost.description
        );
        await DataScienceService.updatePost(editingPost);
      }
      
      // Refresh the posts list
      await onRefresh();
      
      setEditingPost(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      setDeleting(postId);
      await DataScienceService.deletePost(postId);
      await onRefresh();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const updateEditingPost = (field: keyof DataSciencePost, value: any) => {
    if (!editingPost) return;
    setEditingPost({ ...editingPost, [field]: value });
  };

  const addTag = (tag: string) => {
    if (!editingPost || !tag.trim()) return;
    const newTags = [...editingPost.tags, tag.trim()];
    updateEditingPost('tags', newTags);
  };

  const removeTag = (index: number) => {
    if (!editingPost) return;
    const newTags = editingPost.tags.filter((_, i) => i !== index);
    updateEditingPost('tags', newTags);
  };

  const addMethodology = (method: string) => {
    if (!editingPost || !method.trim()) return;
    const newMethodology = [...editingPost.methodology, method.trim()];
    updateEditingPost('methodology', newMethodology);
  };

  const removeMethodology = (index: number) => {
    if (!editingPost) return;
    const newMethodology = editingPost.methodology.filter((_, i) => i !== index);
    updateEditingPost('methodology', newMethodology);
  };

  const handleMediaUpload = async (file: File) => {
    if (!editingPost) return;
    
    try {
      const url = await DataScienceService.uploadMedia(file, editingPost.id);
      const newMediaItem: MediaItem = {
        id: Date.now().toString(),
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        url,
        caption: '',
        alt: file.name
      };
      
      const updatedMedia = [...editingPost.media, newMediaItem];
      updateEditingPost('media', updatedMedia);
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media. Please try again.');
    }
  };

  const handleSearchResults = (results: any[]) => {
    setIsSearchActive(results.length > 0);
    if (results.length > 0) {
      setFilteredPosts(results.map(r => r.post));
    } else {
      setFilteredPosts(posts);
    }
  };

  if (editingPost) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {isCreating ? 'Create New Post' : 'Edit Post'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditingPost(null);
                  setIsCreating(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) => updateEditingPost('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter post title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editingPost.status}
                    onChange={(e) => updateEditingPost('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingPost.description}
                  onChange={(e) => updateEditingPost('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Brief description of the project..."
                />
              </div>

              {/* URLs */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={editingPost.githubUrl || ''}
                    onChange={(e) => updateEditingPost('githubUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Demo URL</label>
                  <input
                    type="url"
                    value={editingPost.demoUrl || ''}
                    onChange={(e) => updateEditingPost('demoUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="https://demo.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dataset URL</label>
                  <input
                    type="url"
                    value={editingPost.datasetUrl || ''}
                    onChange={(e) => updateEditingPost('datasetUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="https://kaggle.com/..."
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingPost.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(index)}
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tag and press Enter..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              {/* Methodology */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Methodology</label>
                <div className="space-y-2 mb-2">
                  {editingPost.methodology.map((method, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="flex-1">{method}</span>
                      <button
                        onClick={() => removeMethodology(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add methodology step and press Enter..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addMethodology(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>

              {/* Results */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Results</label>
                <textarea
                  value={editingPost.results}
                  onChange={(e) => updateEditingPost('results', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Summarize the key results and achievements..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => updateEditingPost('content', e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                  placeholder="Write your post content in Markdown format..."
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingPost.featured}
                  onChange={(e) => updateEditingPost('featured', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Post
                </label>
              </div>
            </div>
          </div>
            {/* Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Files</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMediaUpload(file);
                  }}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600">Click to upload media files</span>
                  <span className="text-sm text-gray-500">Images, videos, or documents</span>
                </label>
              </div>
              
              {/* Media Preview */}
              {editingPost.media.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {editingPost.media.map((media, index) => (
                    <div key={media.id} className="relative group">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.alt}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-gray-600">{media.type}</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const updatedMedia = editingPost.media.filter((_, i) => i !== index);
                          updateEditingPost('media', updatedMedia);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Data Science Posts Admin</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <SearchBar
            onResultSelect={(post) => handleEdit(post)}
            onResultsChange={handleSearchResults}
            placeholder="Search posts to edit..."
            showFilters={true}
            className="max-w-2xl"
          />
          
          {isSearchActive && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Showing {filteredPosts.length} search result{filteredPosts.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
        {/* Posts List */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {filteredPosts.length === 0 && isSearchActive && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No posts found</p>
              <p className="text-sm text-gray-400">Try different keywords or check your spelling</p>
            </div>
          )}
          
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'completed' ? 'bg-green-100 text-green-800' :
                      post.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                    {post.featured && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{post.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-white text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white text-gray-500 rounded text-xs">
                        +{post.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(post)}
                    disabled={deleting === post.id}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {deleting === post.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;