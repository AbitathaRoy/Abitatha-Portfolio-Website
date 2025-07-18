import React from 'react';
import { Brain, Zap, Cpu } from 'lucide-react';

const GenAICorner: React.FC = () => {
  return (
    <div className="min-h-screen p-8 lg:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-full text-sm font-medium text-violet-700 mb-6">
            <Brain className="w-4 h-4" />
            Gen AI Corner
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Generative AI Experiments
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exploring the frontiers of artificial intelligence through fine-tuning, prompt engineering, 
            and building intelligent applications that push the boundaries of what's possible.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Model Fine-tuning</h3>
              <p className="text-gray-600">Customizing pre-trained models for specific tasks and domains to achieve better performance and relevance.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Prompt Engineering</h3>
              <p className="text-gray-600">Crafting effective prompts to get the best results from large language models and AI systems.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Applications</h3>
              <p className="text-gray-600">Building practical applications that leverage AI capabilities to solve real-world problems.</p>
            </div>
          </div>

          <div className="mt-16 p-12 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Projects</h2>
            <p className="text-gray-600 mb-8">
              I'm currently exploring fine-tuning techniques for domain-specific applications and building 
              AI-powered tools that integrate with my other projects. Exciting developments coming soon!
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
              + Add AI Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenAICorner;