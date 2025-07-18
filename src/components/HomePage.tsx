import React from 'react';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Code } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ContentService } from '../services/contentService';
import AdminLogin from './AdminLogin';
import ContentEditor from './ContentEditor';

const HomePage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [heroContent, statsContent, socialContent] = await Promise.all([
        ContentService.getContentBySection('home_hero'),
        ContentService.getContentBySection('home_stats'),
        ContentService.getContentBySection('social_links')
      ]);
      
      setContent({
        hero: heroContent,
        stats: statsContent,
        social: socialContent
      });
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 lg:p-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 lg:p-16">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="fixed top-4 right-4 z-40">
          <button
            onClick={() => setShowContentEditor(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Edit Page
          </button>
        </div>
      )}

      {!isAdmin && (
        <div className="fixed top-4 right-4 z-40">
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
          >
            Admin
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-700">
                <Sparkles className="w-4 h-4" />
                {content.hero?.badge_text || 'Aspiring Data Scientist'}
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                {content.hero?.main_title || 'Turning Data into'}
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {content.hero?.highlight_title || 'Insights'}
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                {content.hero?.description || '3rd year B.Tech. student at University of Delhi, passionate about extracting meaningful patterns from data and building intelligent solutions that make a difference.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2">
                {content.hero?.cta_primary || 'Explore My Work'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 hover:border-blue-300 hover:text-blue-600 hover:shadow-lg">
                {content.hero?.cta_secondary || 'Download Resume'}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{content.stats?.projects_count || '15'}+</div>
                <div className="text-sm text-gray-600">{content.stats?.projects_label || 'Projects'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{content.stats?.technologies_count || '5'}+</div>
                <div className="text-sm text-gray-600">{content.stats?.technologies_label || 'Technologies'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{content.stats?.experience_count || '2'}</div>
                <div className="text-sm text-gray-600">{content.stats?.experience_label || 'Years Learning'}</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Data Analysis</h3>
                      <p className="text-sm text-gray-600">Python • R • SQL</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Machine Learning</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Data Visualization</span>
                      <span className="font-medium">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full w-[90%]"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Statistical Analysis</span>
                      <span className="font-medium">80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full w-[80%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                <Code className="w-8 h-8 text-white" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Featured Corners Preview */}
        <div className="mt-24 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Explore My Corners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover different facets of my journey - from data science projects to UI/UX designs, 
              Gen AI experiments, and knowledge sharing through quizzes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Data Science', desc: 'ML models & analysis', color: 'from-emerald-500 to-teal-600', icon: '📊' },
              { title: 'UI/UX Design', desc: 'Creative interfaces', color: 'from-pink-500 to-rose-600', icon: '🎨' },
              { title: 'Gen AI', desc: 'AI experiments', color: 'from-violet-500 to-indigo-600', icon: '🧠' },
              { title: 'Quizzing', desc: 'Knowledge sharing', color: 'from-orange-500 to-amber-600', icon: '❓' }
            ].map((corner, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`w-12 h-12 bg-gradient-to-r ${corner.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {corner.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{corner.title}</h3>
                  <p className="text-gray-600 text-sm">{corner.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
      {showContentEditor && (
        <ContentEditor 
          onClose={() => {
            setShowContentEditor(false);
            loadContent(); // Reload content after editing
          }} 
        />
      )}
    </div>
  );
};

export default HomePage;