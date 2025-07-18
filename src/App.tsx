import React, { useState } from 'react';
import { useEffect } from 'react';
import { Database, Palette, Brain, HelpCircle, User, Github, Linkedin, Mail } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { ContentService } from './services/contentService';
import WheelNavigation from './components/WheelNavigation';
import HomePage from './components/HomePage';
import DataScienceCorner from './components/DataScienceCorner';
import UIUXCorner from './components/UIUXCorner';
import GenAICorner from './components/GenAICorner';
import QuizzingCorner from './components/QuizzingCorner';
import AboutSection from './components/AboutSection';

export type Corner = 'home' | 'data-science' | 'ui-ux' | 'gen-ai' | 'quizzing' | 'about';

const corners = [
  { id: 'home' as Corner, name: 'Home', icon: User, color: 'from-blue-500 to-purple-600' },
  { id: 'data-science' as Corner, name: 'Data Science', icon: Database, color: 'from-emerald-500 to-teal-600' },
  { id: 'ui-ux' as Corner, name: 'UI/UX', icon: Palette, color: 'from-pink-500 to-rose-600' },
  { id: 'gen-ai' as Corner, name: 'Gen AI', icon: Brain, color: 'from-violet-500 to-indigo-600' },
  { id: 'quizzing' as Corner, name: 'Quizzing', icon: HelpCircle, color: 'from-orange-500 to-amber-600' },
  { id: 'about' as Corner, name: 'About', icon: User, color: 'from-slate-500 to-gray-600' },
];

function App() {
  const [activeCorner, setActiveCorner] = useState<Corner>('home');
  const { isAdmin } = useAuth();
  const [socialLinks, setSocialLinks] = useState<any>({});

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const links = await ContentService.getContentBySection('social_links');
      setSocialLinks(links);
    } catch (error) {
      console.error('Error loading social links:', error);
    }
  };
  const renderActiveCorner = () => {
    switch (activeCorner) {
      case 'home':
        return <HomePage />;
      case 'data-science':
        return <DataScienceCorner />;
      case 'ui-ux':
        return <UIUXCorner />;
      case 'gen-ai':
        return <GenAICorner />;
      case 'quizzing':
        return <QuizzingCorner />;
      case 'about':
        return <AboutSection />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <WheelNavigation 
        corners={corners}
        activeCorner={activeCorner}
        onCornerChange={setActiveCorner}
      />
      
      <main className="ml-16 transition-all duration-500">
        {renderActiveCorner()}
      </main>

      {/* Social Links - Fixed Bottom Right */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3">
        <a 
          href={socialLinks.github_url || "#"} 
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        >
          <Github className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
        </a>
        <a 
          href={socialLinks.linkedin_url || "#"} 
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        >
          <Linkedin className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
        </a>
        <a 
          href={socialLinks.email_url || "#"} 
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        >
          <Mail className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
        </a>
      </div>
    </div>
  );
}

export default App;