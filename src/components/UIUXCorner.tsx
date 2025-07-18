import React from 'react';
import { Palette, Eye, Heart } from 'lucide-react';

const UIUXCorner: React.FC = () => {
  return (
    <div className="min-h-screen p-8 lg:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full text-sm font-medium text-pink-700 mb-6">
            <Palette className="w-4 h-4" />
            UI/UX Corner
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Design & User Experience
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crafting beautiful, intuitive interfaces that delight users. This corner showcases my journey 
            in design thinking, user research, and creating meaningful digital experiences.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visual Design</h3>
              <p className="text-gray-600">Creating aesthetically pleasing interfaces with attention to typography, color theory, and visual hierarchy.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">User Research</h3>
              <p className="text-gray-600">Understanding user needs through research, personas, and usability testing to create user-centered designs.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Prototyping</h3>
              <p className="text-gray-600">Building interactive prototypes to test ideas and iterate on design solutions before development.</p>
            </div>
          </div>

          <div className="mt-16 p-12 bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-8">
              I'm currently working on some exciting design projects that will be showcased here soon. 
              Stay tuned for mobile app designs, web interfaces, and design system explorations!
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
              + Add Design Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIUXCorner;