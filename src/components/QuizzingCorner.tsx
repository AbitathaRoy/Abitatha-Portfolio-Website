import React from 'react';
import { HelpCircle, BookOpen, Trophy } from 'lucide-react';

const QuizzingCorner: React.FC = () => {
  return (
    <div className="min-h-screen p-8 lg:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full text-sm font-medium text-orange-700 mb-6">
            <HelpCircle className="w-4 h-4" />
            Quizzing Corner
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Knowledge & Quizzing
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sharing interesting facts, insights, and knowledge through interactive quizzes. 
            This corner combines my love for learning with AI-powered knowledge extraction and quiz generation.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Knowledge Sharing</h3>
              <p className="text-gray-600">Curating and sharing interesting facts, insights, and learnings from various domains and experiences.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Quizzes</h3>
              <p className="text-gray-600">Creating engaging quizzes that test knowledge and help others learn in an interactive way.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI-Powered Insights</h3>
              <p className="text-gray-600">Using AI to extract meaningful patterns and generate quiz questions from accumulated knowledge.</p>
            </div>
          </div>

          <div className="mt-16 p-12 bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Learning Hub</h2>
            <p className="text-gray-600 mb-8">
              This space will feature AI-generated quizzes, knowledge cards, and interactive learning experiences 
              based on the content I've read and learned. A perfect blend of knowledge sharing and technology!
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
              + Add Knowledge Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzingCorner;