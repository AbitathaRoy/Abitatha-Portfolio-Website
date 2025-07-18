import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Loader, Sparkles } from 'lucide-react';
import { SearchService, SearchResult, SearchOptions } from '../services/searchService';
import { DataSciencePost } from '../types/DataSciencePost';

interface SearchBarProps {
  onResultSelect?: (post: DataSciencePost) => void;
  onResultsChange?: (results: SearchResult[]) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onResultSelect,
  onResultsChange,
  placeholder = "Search projects...",
  showFilters = true,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    limit: 10,
    threshold: 0.3,
    filters: {}
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const previousQueryRef = useRef<string>('');
  const previousOptionsRef = useRef<string>('');

  // Handle search with debouncing
  useEffect(() => {
    // Convert searchOptions to string for comparison
    const currentOptionsString = JSON.stringify(searchOptions);
    
    // Check if query or options actually changed
    if (query === previousQueryRef.current && currentOptionsString === previousOptionsRef.current) {
      return; // No change, don't search
    }
    
    // Update refs with current values
    previousQueryRef.current = query;
    previousOptionsRef.current = currentOptionsString;
    
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If query is empty, clear results immediately
    if (query.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      onResultsChange?.([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const searchResults = await SearchService.hybridSearch(query, searchOptions);
        setResults(searchResults);
        setShowResults(true);
        onResultsChange?.(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    // Cleanup timeout on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchOptions, onResultsChange]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFiltersPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (post: DataSciencePost) => {
    onResultSelect?.(post);
    setShowResults(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onResultsChange?.([]);
    inputRef.current?.focus();
  };

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'semantic':
        return <Sparkles className="w-3 h-3 text-purple-500" />;
      case 'exact':
        return <Search className="w-3 h-3 text-green-500" />;
      default:
        return <Search className="w-3 h-3 text-blue-500" />;
    }
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'semantic':
        return 'AI Match';
      case 'exact':
        return 'Exact Match';
      default:
        return 'Text Match';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm transition-all duration-200"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          {showFilters && (
            <button
              onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
              className={`p-1 rounded-full transition-colors ${
                isFiltersPanelOpen ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 border-b border-gray-100">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
            
            {results.map((result, index) => (
              <button
                key={result.post.id}
                onClick={() => handleResultClick(result.post)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getMatchTypeIcon(result.matchType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                        {result.post.title}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {getMatchTypeLabel(result.matchType)}
                      </span>
                      {result.similarity && (
                        <span className="text-xs text-purple-500">
                          {Math.round(result.similarity * 100)}%
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {result.post.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatDate(result.post.createdOn)}</span>
                      <div className="flex gap-1">
                        {result.post.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {result.post.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            +{result.post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && results.length === 0 && query.trim() && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6 text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 mb-1">No results found</p>
          <p className="text-sm text-gray-400">Try different keywords or check your spelling</p>
        </div>
      )}

      {/* Filters Panel */}
      {isFiltersPanelOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 w-80">
          <h3 className="font-medium text-gray-900 mb-3">Search Filters</h3>
          
          {/* Status Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2">
              {['completed', 'in-progress', 'planned'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    const currentFilters = searchOptions.filters?.status || [];
                    const newFilters = currentFilters.includes(status)
                      ? currentFilters.filter(s => s !== status)
                      : [...currentFilters, status];
                    
                    setSearchOptions({
                      ...searchOptions,
                      filters: {
                        ...searchOptions.filters,
                        status: newFilters.length > 0 ? newFilters : undefined
                      }
                    });
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    searchOptions.filters?.status?.includes(status)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Filter */}
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={searchOptions.filters?.featured === true}
                onChange={(e) => {
                  setSearchOptions({
                    ...searchOptions,
                    filters: {
                      ...searchOptions.filters,
                      featured: e.target.checked ? true : undefined
                    }
                  });
                }}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Featured only</span>
            </label>
          </div>

          {/* Similarity Threshold */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Match Sensitivity: {Math.round((searchOptions.threshold || 0.3) * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={searchOptions.threshold || 0.3}
              onChange={(e) => {
                setSearchOptions({
                  ...searchOptions,
                  threshold: parseFloat(e.target.value)
                });
              }}
              className="w-full"
            />
          </div>

          <button
            onClick={() => {
              setSearchOptions({
                limit: 10,
                threshold: 0.3,
                filters: {}
              });
            }}
            className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;