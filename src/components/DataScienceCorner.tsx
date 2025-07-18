import React from 'react';
import { ExternalLink, Github, Calendar, Tag, Settings, RefreshCw, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ContentService } from '../services/contentService';
import { DataSciencePost } from '../types/DataSciencePost';
import { DataScienceService } from '../services/dataScienceService';
import { SearchService, SearchResult } from '../services/searchService';
import PostDetailView from './PostDetailView';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';
import ContentEditor from './ContentEditor';
import SearchBar from './SearchBar';

const DataScienceCorner: React.FC = () => {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<DataSciencePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<DataSciencePost[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<DataSciencePost | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [updatingEmbeddings, setUpdatingEmbeddings] = useState(false);
  const [pageContent, setPageContent] = useState<any>({});

  // Load posts from Supabase
  useEffect(() => {
    loadPosts();
    loadPageContent();
  }, []);

  const loadPageContent = async () => {
    try {
      const content = await ContentService.getContentBySection('data_science_header');
      setPageContent(content);
    } catch (error) {
      console.error('Error loading page content:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DataScienceService.getAllPosts();
      if (result.success && result.data) {
        setPosts(result.data);
        setFilteredPosts(result.data);
      } else {
        setError(result.error || 'Failed to load posts');
        setPosts([]);
        setFilteredPosts([]);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Make sure Supabase tables are created.');
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostsUpdate = (updatedPosts: DataSciencePost[]) => {
    setPosts(updatedPosts);
    if (!isSearchActive) {
      setFilteredPosts(updatedPosts);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
    setIsSearchActive(results.length > 0);
    
    if (results.length > 0) {
      setFilteredPosts(results.map(r => r.post));
    } else {
      setFilteredPosts(posts);
    }
  };

  const handleUpdateEmbeddings = async () => {
    setUpdatingEmbeddings(true);
    try {
      await SearchService.updateAllEmbeddings();
      alert('Embeddings updated successfully!');
    } catch (error) {
      console.error('Error updating embeddings:', error);
      alert('Failed to update embeddings. Please try again.');
    } finally {
      setUpdatingEmbeddings(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getFirstImage = (post: DataSciencePost) => {
    return post.media.find(m => m.type === 'image')?.url || 
           'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 lg:p-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 lg:p-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadPosts}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 lg:p-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full text-sm font-medium text-emerald-700 mb-6">
            📊 Data Science Corner
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            {pageContent.title || 'Data Science Projects'}
          </h1>
          
          <div className="flex items-center justify-between">
            <p className="text-xl text-gray-600 max-w-3xl">
              {pageContent.description || 'Exploring the world of data through machine learning, statistical analysis, and predictive modeling. Each project represents a journey of discovery and learning.'}
            </p>
            
            {isAdmin ? (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateEmbeddings}
                  disabled={updatingEmbeddings}
                  className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${updatingEmbeddings ? 'animate-spin' : ''}`} />
                  {updatingEmbeddings ? 'Updating...' : 'Update AI'}
                </button>
                
                <button
                  onClick={() => setShowContentEditor(true)}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Page
                </button>
                
                <button
                  onClick={() => setShowAdmin(true)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar
            onResultSelect={setSelectedPost}
            onResultsChange={handleSearchResults}
            placeholder="Search projects using AI or keywords..."
            showFilters={true}
            className="max-w-2xl mx-auto"
          />
          
          {isSearchActive && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Showing {filteredPosts.length} search result{filteredPosts.length !== 1 ? 's' : ''}
                {searchResults.some(r => r.matchType === 'semantic') && (
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    AI-powered
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
        {/* Featured Projects */}
        {filteredPosts.filter(p => p.featured).length > 0 && (
          <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Projects</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredPosts.filter(p => p.featured).map((project) => (
              <div 
                key={project.id} 
                className="group cursor-pointer"
                onClick={() => setSelectedPost(project)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getFirstImage(project)} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <a 
                        href={project.githubUrl}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Github className="w-4 h-4 text-gray-700" />
                      </a>
                      <a 
                        href={project.demoUrl}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-700" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      {formatDate(project.createdOn)}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* All Projects */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {isSearchActive ? 'Search Results' : 'All Projects'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((project) => (
              <div 
                key={project.id} 
                className="group cursor-pointer"
                onClick={() => setSelectedPost(project)}
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <img 
                      src={getFirstImage(project)} 
                      alt={project.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {project.featured && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        Featured
                      </div>
                    )}
                    
                    {/* Search Match Indicator */}
                    {isSearchActive && searchResults.find(r => r.post.id === project.id) && (
                      <div className="absolute top-2 right-2">
                        {(() => {
                          const result = searchResults.find(r => r.post.id === project.id);
                          if (result?.matchType === 'semantic') {
                            return (
                              <div className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 bg-white rounded-full"></span>
                                AI Match
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(project.createdOn)}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.slice(0, 2).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <a 
                        href={project.githubUrl}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                      <a 
                        href={project.demoUrl}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Empty State */}
        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {isSearchActive ? (
                <>
                  <Search className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">No projects found</p>
                  <p className="text-sm">Try different keywords or adjust your search filters</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">No projects yet</p>
                  <p className="text-sm">Create your first project using the admin panel</p>
                </>
              )}
            </div>
          </div>
        )}

        
      </div>

      {/* Modals */}
      {selectedPost && (
        <PostDetailView post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
      
      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
      
      {showContentEditor && (
        <ContentEditor 
          section="data_science_header"
          onClose={() => {
            setShowContentEditor(false);
            loadPageContent();
          }} 
        />
      )}
      
      {showAdmin && (
        <AdminPanel 
          posts={posts} 
          onClose={() => setShowAdmin(false)} 
          onSave={handlePostsUpdate}
          onRefresh={loadPosts}
        />
      )}
    </div>
  );
};

export default DataScienceCorner;