import React from 'react';
import { X, Calendar, Tag, Github, ExternalLink, Database, Clock, CheckCircle, AlertCircle, Pause } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DataSciencePost } from '../types/DataSciencePost';

interface PostDetailViewProps {
  post: DataSciencePost;
  onClose: () => void;
}

const PostDetailView: React.FC<PostDetailViewProps> = ({ post, onClose }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'planned':
        return <Pause className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(post.status)}`}>
              {getStatusIcon(post.status)}
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </div>
            {post.featured && (
              <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                Featured
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-8">
            {/* Title & Meta */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{post.description}</p>
              
              {/* Meta Information */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(post.createdOn)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {formatDate(post.updatedOn)}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex gap-4">
                {post.githubUrl && (
                  <a 
                    href={post.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                )}
                {post.demoUrl && (
                  <a 
                    href={post.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {post.datasetUrl && (
                  <a 
                    href={post.datasetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Database className="w-4 h-4" />
                    Dataset
                  </a>
                )}
              </div>
            </div>

            {/* Main Content with Markdown */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="markdown-content"
                components={{
                  h1: ({node, ...props}) => (
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8" {...props} />
                  ),
                  h2: ({node, ...props}) => (
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6" {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="mb-4 leading-relaxed text-gray-700" {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="mb-4 space-y-2 list-disc list-inside text-gray-700" {...props} />
                  ),
                  ol: ({node, ...props}) => (
                    <ol className="mb-4 space-y-2 list-decimal list-inside text-gray-700" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="leading-relaxed" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-6">
                      <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => (
                    <thead className="bg-gray-50" {...props} />
                  ),
                  th: ({node, ...props}) => (
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="border border-gray-300 px-4 py-3 text-gray-700" {...props} />
                  ),
                  tr: ({node, ...props}) => (
                    <tr className="hover:bg-gray-50 transition-colors" {...props} />
                  ),
                  code: ({node, inline, ...props}) => {
                    if (inline) {
                      return (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props} />
                      );
                    }
                    return (
                      <code className="block bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono" {...props} />
                    );
                  },
                  pre: ({node, ...props}) => (
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4" {...props} />
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-emerald-500 pl-4 my-4 italic text-gray-600" {...props} />
                  ),
                  strong: ({node, ...props}) => (
                    <strong className="font-semibold text-gray-900" {...props} />
                  ),
                  em: ({node, ...props}) => (
                    <em className="italic" {...props} />
                  ),
                  img: ({node, ...props}) => (
                    <img className="w-full rounded-lg shadow-lg my-6" {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className="text-emerald-600 hover:text-emerald-700 underline" {...props} />
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Methodology & Results */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Methodology</h3>
                <ul className="space-y-2">
                  {post.methodology.map((method, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      {method}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Results</h3>
                <p className="text-gray-700 leading-relaxed">{post.results}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailView;